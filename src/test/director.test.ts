import { describe, expect, it } from "vitest";
import { createDirectorSystemPrompt, DirectorProjectContextError } from "@/lib/director-prompt";
import { chatInputSchema, type DirectorProject } from "@/lib/director-functions";

const project: DirectorProject = {
  id: "00000000-0000-4000-8000-000000000001",
  name: "Retrato de campanha",
  description: "Retratos editoriais com atmosfera intimista.",
  client: "Estúdio Aurora",
  category: "Fotografia",
  status: "Em andamento",
  priority: "Alta",
  start_date: "2026-11-20",
  deadline: "2026-12-10",
  briefing: { audience: "Público jovem adulto", lighting: "Luz suave" },
};

describe("IA Director request validation", () => {
  it("accepts a free conversation without sending a workspace identifier", () => {
    expect(
      chatInputSchema.safeParse({
        projectId: null,
        messages: [{ role: "user", content: "Preciso de um conceito." }],
      }).success,
    ).toBe(true);
    expect(
      chatInputSchema.safeParse({
        projectId: null,
        workspaceId: "00000000-0000-4000-8000-000000000001",
        messages: [{ role: "user", content: "Preciso de um conceito." }],
      }).success,
    ).toBe(false);
  });

  it("rejects oversized messages and histories ending with an assistant message", () => {
    expect(
      chatInputSchema.safeParse({
        projectId: null,
        messages: [{ role: "user", content: "a".repeat(4_001) }],
      }).success,
    ).toBe(false);
    expect(
      chatInputSchema.safeParse({
        projectId: null,
        messages: [{ role: "assistant", content: "Resposta anterior." }],
      }).success,
    ).toBe(false);
  });
});

describe("IA Director system prompt", () => {
  it("includes the selected project's creative context and tailored lighting direction", () => {
    const prompt = createDirectorSystemPrompt(project);
    expect(prompt).toContain("Retrato de campanha");
    expect(prompt).toContain("Fotografia");
    expect(prompt).toContain("Luz suave");
    expect(prompt).toContain("luz principal");
  });

  it("keeps free conversations independent of project data", () => {
    const prompt = createDirectorSystemPrompt(null);
    expect(prompt).toContain("modo livre");
    expect(prompt).not.toContain("Retrato de campanha");
  });

  it("preserves empty and null briefings as valid project context", () => {
    const emptyBriefing = createDirectorSystemPrompt({ ...project, briefing: {} });
    const missingBriefing = createDirectorSystemPrompt({ ...project, briefing: null });

    expect(emptyBriefing).toContain('"briefing": {}');
    expect(missingBriefing).toContain('"briefing": null');
    expect(missingBriefing).toContain("Retratos editoriais com atmosfera intimista.");
  });

  it("reports malformed project fields as context errors rather than provider failures", () => {
    const malformedProject = { ...project, description: null } as unknown as DirectorProject;

    expect(() => createDirectorSystemPrompt(malformedProject)).toThrow(DirectorProjectContextError);
    expect(() => createDirectorSystemPrompt(malformedProject)).toThrow(
      "Invalid project context field: description",
    );
  });
});
