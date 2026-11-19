import "server-only";

type BuildUpstreamRequestInitOptions = {
  request: Request;
  headers: Headers;
  timeoutMs?: number;
};

type NodeRequestInit = RequestInit & {
  duplex?: "half";
};

const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_TIMEOUT_MS = 2 ** 32 - 1;

const BODYLESS_METHODS = new Set(["GET", "HEAD"]);

function createRequestSignal(
  requestSignal: AbortSignal,
  timeoutMs: number,
): AbortSignal {
  if (
    !Number.isSafeInteger(timeoutMs) ||
    timeoutMs <= 0 ||
    timeoutMs > MAX_TIMEOUT_MS
  ) {
    throw new Error("Invalid upstream request timeout.");
  }

  return AbortSignal.any([
    requestSignal,
    AbortSignal.timeout(timeoutMs),
  ]);
}

export function buildUpstreamRequestInit({
  request,
  headers,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: BuildUpstreamRequestInitOptions): RequestInit {
  const method = request.method.toUpperCase();

  const init: NodeRequestInit = {
    method,
    headers,
    cache: "no-store",
    redirect: "manual",
    signal: createRequestSignal(request.signal, timeoutMs),
  };

  if (!BODYLESS_METHODS.has(method) && request.body !== null) {
    init.body = request.body;
    init.duplex = "half";
  }

  return init;
}