import { createGoogle } from "@ai-sdk/google";
import { APICallError, generateText, type ModelMessage } from "ai";
import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database, Json } from "@/integrations/supabase/types";
import { createDirectorSystemPrompt, DirectorProjectContextError } from "@/lib/director-prompt";
import { generateWithGeminiRetry, GeminiTemporaryUnavailableError } from "@/lib/gemini-retry";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(4_000),
});

export const chatInputSchema = z
  .object({
    projectId: z.string().uuid().nullable(),
    messages: z.array(messageSchema).min(1).max(20),
  })
  .strict()
  .refine(
    (value) =>
      value.messages.reduce((total, message) => total + message.content.length, 0) <= 24_000,
    { message: "O histórico desta conversa é longo demais." },
  )
  .refine((value) => value.messages.at(-1)?.role === "user", {
    message: "A última mensagem precisa ser da pessoa usuária.",
  });

export type DirectorProject = {
  id: string;
  name: string;
  description: string;
  client: string;
  category: string;
  status: string;
  priority: string | null;
  start_date: string | null;
  deadline: string | null;
  briefing: Json | null;
};

export type DirectorProjectOption = Pick<
  DirectorProject,
  "id" | "name" | "client" | "category" | "status"
>;

const projectSelection =
  "id,name,description,client,category,status,priority,start_date,deadline,briefing";
const projectListSelection = "id,name,client,category,status";

function errorType(error: unknown): string {
  if (error instanceof Error) return error.name;
  if (typeof error === "object" && error !== null && "name" in error) {
    return typeof error.name === "string" ? error.name : "UnknownError";
  }
  return typeof error;
}

async function findUserWorkspace(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("workspaces")
    .select("id")
    .eq("owner_id", userId)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data?.id ?? null;
}

export const listDirectorProjects = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    try {
      const workspaceId = await findUserWorkspace(context.supabase, context.userId);
      if (!workspaceId) return { ok: true as const, projects: [] as DirectorProjectOption[] };

      const { data, error } = await context.supabase
        .from("projects")
        .select(projectListSelection)
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return { ok: true as const, projects: (data ?? []) as DirectorProjectOption[] };
    } catch (error) {
      console.error("IA Director: falha ao carregar projetos.", {
        stage: "project_list",
        errorType: errorType(error),
      });
      return { ok: false as const, code: "PROJECTS_UNAVAILABLE" as const };
    }
  });

export const sendDirectorMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(chatInputSchema)
  .handler(async ({ data, context }) => {
    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) {
      console.error("IA Director: GEMINI_API_KEY não está configurada no servidor.");
      return { ok: false as const, code: "AI_NOT_CONFIGURED" as const };
    }

    let project: DirectorProject | null = null;
    if (data.projectId) {
      try {
        const workspaceId = await findUserWorkspace(context.supabase, context.userId);
        if (!workspaceId) return { ok: false as const, code: "PROJECT_NOT_FOUND" as const };

        const { data: projectData, error } = await context.supabase
          .from("projects")
          .select(projectSelection)
          .eq("id", data.projectId)
          .eq("workspace_id", workspaceId)
          .maybeSingle();
        if (error) throw error;
        if (!projectData) return { ok: false as const, code: "PROJECT_NOT_FOUND" as const };
        project = projectData as DirectorProject;
      } catch (error) {
        console.error("IA Director: falha ao recuperar contexto do projeto.", {
          stage: "project_lookup",
          errorType: errorType(error),
        });
        return { ok: false as const, code: "PROJECT_UNAVAILABLE" as const };
      }
    }

    const google = createGoogle({ apiKey });
    const model = process.env["GEMINI_MODEL"]?.trim() || "gemini-2.5-flash";
    const messages = data.messages.slice(-12).map((message): ModelMessage => ({
      role: message.role,
      content: message.content,
    }));
    let system: string;
    try {
      system = createDirectorSystemPrompt(project);
    } catch (error) {
      console.error("IA Director: falha ao montar o contexto da conversa.", {
        stage: "prompt_context",
        projectSelected: project !== null,
        field: error instanceof DirectorProjectContextError ? error.field : "unknown",
        errorType: errorType(error),
      });
      return {
        ok: false as const,
        code: project ? ("PROJECT_CONTEXT_INVALID" as const) : ("AI_INTERNAL_ERROR" as const),
      };
    }

    try {
      const result = await generateWithGeminiRetry((signal) =>
        generateText({
          model: google(model),
          system,
          messages,
          maxRetries: 0,
          maxOutputTokens: 1_200,
          abortSignal: signal,
        }),
      );
      const text = result.text.trim();
      if (!text) {
        return { ok: false as const, code: "EMPTY_RESPONSE" as const };
      }
      return { ok: true as const, text };
    } catch (error) {
      if (error instanceof GeminiTemporaryUnavailableError) {
        console.warn(
          `IA Director: Gemini permaneceu indisponível após ${error.attempts} tentativa(s).`,
        );
        return { ok: false as const, code: "AI_TEMPORARILY_UNAVAILABLE" as const };
      }

      if (!APICallError.isInstance(error)) {
        console.error("IA Director: erro interno durante a geração da resposta.", {
          stage: "generate_text",
          projectSelected: project !== null,
          errorType: errorType(error),
        });
        return { ok: false as const, code: "AI_INTERNAL_ERROR" as const };
      }

      const statusCode = error.statusCode;

      if (statusCode === 401 || statusCode === 403) {
        console.error("IA Director: erro de autenticação ou modelo do Gemini.", {
          stage: "gemini_provider",
          statusCode,
        });
        return { ok: false as const, code: "AI_AUTHENTICATION" as const };
      }
      if (statusCode === 429) {
        return { ok: false as const, code: "AI_RATE_LIMIT" as const };
      }
      console.error("IA Director: erro retornado pelo provedor Gemini.", {
        stage: "gemini_provider",
        statusCode: statusCode ?? "unknown",
        retryable: error.isRetryable,
      });
      return { ok: false as const, code: "AI_PROVIDER_ERROR" as const };
    }
  });
