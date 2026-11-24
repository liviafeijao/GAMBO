import { act, renderHook, waitFor } from "@testing-library/react";
import { APICallError } from "ai";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDirector } from "@/viewmodels/useDirector";
import { generateWithGeminiRetry, GeminiTemporaryUnavailableError } from "@/lib/gemini-retry";

const { listDirectorProjectsMock, sendDirectorMessageMock } = vi.hoisted(() => ({
  listDirectorProjectsMock: vi.fn(),
  sendDirectorMessageMock: vi.fn(),
}));

vi.mock("@/lib/director-functions", () => ({
  listDirectorProjects: listDirectorProjectsMock,
  sendDirectorMessage: sendDirectorMessageMock,
}));

function apiError(statusCode: number, responseHeaders: Record<string, string> = {}) {
  return new APICallError({
    message:
      statusCode === 503
        ? "This model is currently experiencing high demand."
        : `Gemini returned ${statusCode}.`,
    url: "https://generativelanguage.googleapis.com/",
    requestBodyValues: {},
    statusCode,
    responseHeaders,
  });
}

describe("Gemini temporary availability retry", () => {
  it("returns a normal Gemini response without retrying", async () => {
    const generate = vi.fn().mockResolvedValue("Resposta criativa.");

    await expect(generateWithGeminiRetry(generate)).resolves.toBe("Resposta criativa.");
    expect(generate).toHaveBeenCalledTimes(1);
  });

  it("retries 503 with exponential backoff and succeeds", async () => {
    const generate = vi
      .fn()
      .mockRejectedValueOnce(apiError(503))
      .mockResolvedValue("Resposta após nova tentativa.");
    const sleep = vi.fn().mockResolvedValue(undefined);

    await expect(generateWithGeminiRetry(generate, { sleep })).resolves.toBe(
      "Resposta após nova tentativa.",
    );
    expect(generate).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledWith(500);
  });

  it("honors Retry-After when the provider supplies it", async () => {
    const generate = vi.fn().mockRejectedValue(apiError(503, { "Retry-After": "2" }));
    const sleep = vi.fn().mockResolvedValue(undefined);

    await expect(
      generateWithGeminiRetry(generate, { maxAttempts: 2, sleep }),
    ).rejects.toBeInstanceOf(GeminiTemporaryUnavailableError);
    expect(sleep).toHaveBeenCalledWith(2_000);
    expect(generate).toHaveBeenCalledTimes(2);
  });

  it("does not wait beyond the total retry budget", async () => {
    const generate = vi.fn().mockRejectedValue(apiError(503, { "Retry-After": "2" }));
    const sleep = vi.fn().mockResolvedValue(undefined);

    await expect(
      generateWithGeminiRetry(generate, { totalTimeoutMs: 1_000, sleep }),
    ).rejects.toBeInstanceOf(GeminiTemporaryUnavailableError);
    expect(generate).toHaveBeenCalledTimes(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it("stops after the configured attempt limit when 503 persists", async () => {
    const generate = vi.fn().mockRejectedValue(apiError(503));
    const sleep = vi.fn().mockResolvedValue(undefined);

    await expect(
      generateWithGeminiRetry(generate, { maxAttempts: 3, sleep }),
    ).rejects.toMatchObject({ attempts: 3 });
    expect(generate).toHaveBeenCalledTimes(3);
    expect(sleep).toHaveBeenCalledTimes(2);
  });

  it.each([401, 403])("does not retry permanent HTTP %i errors", async (statusCode) => {
    const error = apiError(statusCode);
    const generate = vi.fn().mockRejectedValue(error);

    await expect(generateWithGeminiRetry(generate)).rejects.toBe(error);
    expect(generate).toHaveBeenCalledTimes(1);
  });
});

describe("IA Director conversation retry", () => {
  const projectId = "00000000-0000-4000-8000-000000000001";

  beforeEach(() => {
    window.localStorage.clear();
    listDirectorProjectsMock.mockResolvedValue({
      ok: true,
      projects: [
        {
          id: projectId,
          name: "Retrato de campanha",
          client: "Estúdio Aurora",
          category: "Fotografia",
          status: "Em andamento",
        },
      ],
    });
    sendDirectorMessageMock.mockReset();
  });

  it("keeps the failed message and project context when retrying without duplicating it", async () => {
    sendDirectorMessageMock
      .mockResolvedValueOnce({ ok: false, code: "AI_TEMPORARILY_UNAVAILABLE" })
      .mockResolvedValueOnce({ ok: true, text: "Use luz suave lateral." });
    const { result } = renderHook(() => useDirector());

    await waitFor(() => expect(result.current.loaded).toBe(true));
    act(() => result.current.startConversation(projectId));
    await act(async () => {
      await result.current.send("Como iluminar o retrato?");
    });

    expect(result.current.canRetry).toBe(true);
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]?.role).toBe("user");
    expect(result.current.error).toContain("temporariamente sobrecarregado");

    await act(async () => {
      await result.current.retryLast();
    });

    expect(sendDirectorMessageMock).toHaveBeenCalledTimes(2);
    expect(sendDirectorMessageMock.mock.calls[0]?.[0].data.projectId).toBe(projectId);
    expect(sendDirectorMessageMock.mock.calls[1]?.[0].data.projectId).toBe(projectId);
    expect(sendDirectorMessageMock.mock.calls[1]?.[0].data.messages).toEqual([
      { role: "user", content: "Como iluminar o retrato?" },
    ]);
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages.filter((message) => message.role === "user")).toHaveLength(1);

    const saved = JSON.parse(window.localStorage.getItem("gambo.aiDirector.v1") ?? "{}");
    expect(saved.conversations[0].messages).toHaveLength(2);
  });
});
