import { APICallError } from "ai";

const MAX_ATTEMPTS = 3;
const TOTAL_TIMEOUT_MS = 30_000;
const ATTEMPT_TIMEOUT_MS = 12_000;
const INITIAL_BACKOFF_MS = 500;

export class GeminiTemporaryUnavailableError extends Error {
  constructor(
    readonly attempts: number,
    options?: ErrorOptions,
  ) {
    super("Gemini is temporarily unavailable.", options);
    this.name = "GeminiTemporaryUnavailableError";
  }
}

export type GeminiRetryOptions = {
  maxAttempts?: number;
  totalTimeoutMs?: number;
  attemptTimeoutMs?: number;
  initialBackoffMs?: number;
  now?: () => number;
  sleep?: (milliseconds: number) => Promise<void>;
};

function defaultSleep(milliseconds: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
}

function getRetryAfterMs(error: APICallError, now: number): number | undefined {
  const retryAfter = Object.entries(error.responseHeaders ?? {}).find(
    ([name]) => name.toLowerCase() === "retry-after",
  )?.[1];
  if (!retryAfter) return undefined;

  const seconds = Number(retryAfter);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1_000;

  const retryAt = Date.parse(retryAfter);
  return Number.isNaN(retryAt) ? undefined : Math.max(0, retryAt - now);
}

export async function generateWithGeminiRetry<T>(
  generate: (signal: AbortSignal) => Promise<T>,
  options: GeminiRetryOptions = {},
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? MAX_ATTEMPTS;
  const totalTimeoutMs = options.totalTimeoutMs ?? TOTAL_TIMEOUT_MS;
  const attemptTimeoutMs = options.attemptTimeoutMs ?? ATTEMPT_TIMEOUT_MS;
  const initialBackoffMs = options.initialBackoffMs ?? INITIAL_BACKOFF_MS;
  const now = options.now ?? Date.now;
  const sleep = options.sleep ?? defaultSleep;
  const deadline = now() + totalTimeoutMs;
  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const remaining = deadline - now();
    if (remaining <= 0) throw new GeminiTemporaryUnavailableError(attempt, { cause: lastError });

    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(new Error("Gemini request timed out.")),
      Math.max(1, Math.min(attemptTimeoutMs, remaining)),
    );

    try {
      const result = await generate(controller.signal);
      if (now() >= deadline) {
        throw new GeminiTemporaryUnavailableError(attempt + 1, { cause: lastError });
      }
      return result;
    } catch (error) {
      lastError = error;
      if (!APICallError.isInstance(error) || error.statusCode !== 503) throw error;

      const attempts = attempt + 1;
      if (attempts >= maxAttempts) {
        throw new GeminiTemporaryUnavailableError(attempts, { cause: error });
      }

      const retryAfterMs = getRetryAfterMs(error, now());
      const delay = retryAfterMs ?? initialBackoffMs * 2 ** (attempts - 1);
      if (delay >= deadline - now()) {
        throw new GeminiTemporaryUnavailableError(attempts, { cause: error });
      }
      clearTimeout(timeout);
      await sleep(delay);
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new GeminiTemporaryUnavailableError(maxAttempts, { cause: lastError });
}
