import { useCallback, useEffect, useRef, useState } from "react";
import {
  listDirectorProjects,
  sendDirectorMessage,
  type DirectorProjectOption,
} from "@/lib/director-functions";

export interface Message {
  id: string;
  role: "assistant" | "user";
  text: string;
}

export interface DirectorConversation {
  id: string;
  title: string;
  projectId: string | null;
  messages: Message[];
  updatedAt: string;
}

const STORAGE_KEY = "gambo.aiDirector.v1";
const MAX_SAVED_CONVERSATIONS = 30;

function createConversation(projectId: string | null = null): DirectorConversation {
  return {
    id: crypto.randomUUID(),
    title: "Uma nova ideia",
    projectId,
    messages: [],
    updatedAt: new Date().toISOString(),
  };
}

function isConversation(value: unknown): value is DirectorConversation {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<DirectorConversation>;
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    (typeof item.projectId === "string" || item.projectId === null) &&
    Array.isArray(item.messages) &&
    item.messages.every(
      (message) =>
        message &&
        typeof message.id === "string" &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.text === "string",
    ) &&
    typeof item.updatedAt === "string"
  );
}

function errorMessage(code: string): string {
  switch (code) {
    case "PROJECT_NOT_FOUND":
      return "Não encontrei esse projeto no seu workspace. Escolha outro projeto ou continue no modo livre.";
    case "PROJECT_UNAVAILABLE":
      return "Não foi possível recuperar os dados deste projeto. Seu histórico foi mantido.";
    case "PROJECT_CONTEXT_INVALID":
      return "Os dados do projeto ou briefing estão incompletos ou inválidos. Revise o projeto antes de tentar novamente.";
    case "PROJECTS_UNAVAILABLE":
      return "Não foi possível carregar seus projetos. Tente novamente mais tarde.";
    case "AI_NOT_CONFIGURED":
      return "O IA Director ainda não está configurado no servidor. Fale com a equipe responsável.";
    case "AI_AUTHENTICATION":
      return "O Gemini recusou a autenticação ou o modelo configurado. Verifique a configuração do servidor.";
    case "AI_PROVIDER_ERROR":
      return "O Gemini retornou um erro ao processar a solicitação. O contexto e o histórico foram preservados.";
    case "AI_INPUT_INVALID":
      return "A mensagem ou o histórico não passou pela validação. Revise o conteúdo e tente novamente.";
    case "AI_INTERNAL_ERROR":
      return "Ocorreu um erro interno ao preparar a solicitação. O histórico foi preservado; revise o contexto e tente novamente.";
    case "AI_RATE_LIMIT":
      return "O Gemini atingiu o limite de requisições. Aguarde um pouco e tente novamente.";
    case "AI_TEMPORARILY_UNAVAILABLE":
      return "O Gemini está temporariamente sobrecarregado. Sua mensagem foi mantida; tente novamente.";
    case "EMPTY_RESPONSE":
      return "O Gemini não retornou uma resposta. Tente reformular sua pergunta.";
    case "AUTH_REQUIRED":
      return "Sua sessão expirou. Entre novamente para continuar usando o IA Director.";
    default:
      return "O IA Director está temporariamente indisponível. Tente novamente em instantes.";
  }
}

function getErrorType(error: unknown): string {
  if (error instanceof Error) return error.name;
  if (typeof error === "object" && error !== null && "name" in error) {
    return typeof error.name === "string" ? error.name : "UnknownError";
  }
  return typeof error;
}

export function useDirector() {
  const [conversations, setConversations] = useState<DirectorConversation[]>([]);
  const [activeId, setActiveId] = useState("");
  const [ideas, setIdeas] = useState<string[]>([]);
  const [projects, setProjects] = useState<DirectorProjectOption[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [canRetry, setCanRetry] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const sending = useRef(false);
  const activeConversation =
    conversations.find((conversation) => conversation.id === activeId) ?? null;

  useEffect(() => {
    let restoredConversations: DirectorConversation[] = [];
    let restoredIdeas: string[] = [];
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          const record = parsed as { conversations?: unknown; ideas?: unknown };
          restoredConversations = Array.isArray(record.conversations)
            ? record.conversations.filter(isConversation).slice(0, MAX_SAVED_CONVERSATIONS)
            : [];
          restoredIdeas = Array.isArray(record.ideas)
            ? record.ideas.filter(
                (idea): idea is string => typeof idea === "string" && idea.length <= 8_000,
              )
            : [];
        }
      }
    } catch (cause) {
      console.error("Não foi possível recuperar o histórico local do IA Director:", cause);
    }
    if (!restoredConversations.length) restoredConversations = [createConversation()];
    setConversations(restoredConversations);
    setActiveId(restoredConversations[0]?.id ?? "");
    setIdeas(restoredIdeas);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          conversations: conversations.slice(0, MAX_SAVED_CONVERSATIONS),
          ideas,
        }),
      );
    } catch (cause) {
      console.error("Não foi possível salvar o histórico local do IA Director:", cause);
    }
  }, [conversations, ideas, loaded]);

  useEffect(() => {
    let active = true;
    listDirectorProjects()
      .then((result) => {
        if (!active) return;
        if (!result.ok) {
          setProjectsError(errorMessage(result.code));
          return;
        }
        setProjects(result.projects);
        setProjectsError("");
      })
      .catch((cause: unknown) => {
        console.error("Não foi possível carregar os projetos do IA Director:", cause);
        if (active) setProjectsError(errorMessage("PROJECTS_UNAVAILABLE"));
      })
      .finally(() => {
        if (active) setProjectsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const startConversation = useCallback((projectId: string | null = null) => {
    const conversation = createConversation(projectId);
    setConversations((previous) => [conversation, ...previous].slice(0, MAX_SAVED_CONVERSATIONS));
    setActiveId(conversation.id);
    setError("");
    setCanRetry(false);
  }, []);

  const openHistory = useCallback((id: string) => {
    setActiveId(id);
    setError("");
    setCanRetry(false);
  }, []);

  const selectProject = useCallback(
    (projectId: string | null) => {
      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === activeId
            ? {
                ...conversation,
                projectId,
                updatedAt: new Date().toISOString(),
              }
            : conversation,
        ),
      );
      setError("");
      setCanRetry(false);
    },
    [activeId],
  );

  const requestResponse = useCallback(
    async (conversation: DirectorConversation, requestMessages: Message[]) => {
      if (sending.current) return;
      sending.current = true;
      setBusy(true);
      setError("");
      setCanRetry(false);

      try {
        const result = await sendDirectorMessage({
          data: {
            projectId: conversation.projectId,
            messages: requestMessages.slice(-12).map(({ role, text: content }) => ({
              role,
              content,
            })),
          },
        });
        if (!result.ok) {
          setError(errorMessage(result.code));
          setCanRetry(result.code === "AI_TEMPORARILY_UNAVAILABLE");
          return;
        }
        const response: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          text: result.text,
        };
        setConversations((previous) =>
          previous.map((item) =>
            item.id === conversation.id
              ? {
                  ...item,
                  messages: [...item.messages, response],
                  updatedAt: new Date().toISOString(),
                }
              : item,
          ),
        );
      } catch (cause) {
        const type = getErrorType(cause);
        console.error("Falha na chamada do IA Director.", {
          errorType: type,
          projectSelected: conversation.projectId !== null,
        });
        const isAuthenticationError =
          cause instanceof Error &&
          /unauthorized|no authorization|invalid token/i.test(cause.message);
        const code = isAuthenticationError
          ? "AUTH_REQUIRED"
          : /zod|validation/i.test(type)
            ? "AI_INPUT_INVALID"
            : "AI_INTERNAL_ERROR";
        setError(errorMessage(code));
      } finally {
        sending.current = false;
        setBusy(false);
      }
    },
    [],
  );

  const send = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      const conversation = conversations.find((item) => item.id === activeId);
      if (!text || !conversation || sending.current) return;
      if (text.length > 4_000) {
        setError("A mensagem pode ter no máximo 4.000 caracteres.");
        return;
      }

      const userMessage: Message = { id: crypto.randomUUID(), role: "user", text };
      const requestMessages = [...conversation.messages, userMessage];
      const title =
        conversation.messages.length === 0
          ? text.length > 48
            ? `${text.slice(0, 48).trimEnd()}…`
            : text
          : conversation.title;

      setConversations((previous) =>
        previous.map((item) =>
          item.id === conversation.id
            ? {
                ...item,
                title,
                messages: requestMessages,
                updatedAt: new Date().toISOString(),
              }
            : item,
        ),
      );
      await requestResponse(conversation, requestMessages);
    },
    [activeId, conversations, requestResponse],
  );

  const retryLast = useCallback(() => {
    if (!canRetry) return;
    const conversation = conversations.find((item) => item.id === activeId);
    if (!conversation || conversation.messages.at(-1)?.role !== "user") return;
    return requestResponse(conversation, conversation.messages);
  }, [activeId, canRetry, conversations, requestResponse]);

  const saveIdea = useCallback((text: string) => {
    setIdeas((previous) => (previous.includes(text) ? previous : [text, ...previous]));
  }, []);

  return {
    messages: activeConversation?.messages ?? [],
    conversation: activeConversation,
    conversations,
    busy,
    error,
    canRetry,
    ideas,
    projects,
    projectsLoading,
    projectsError,
    loaded,
    send,
    retryLast,
    startConversation,
    openHistory,
    selectProject,
    saveIdea,
  };
}
