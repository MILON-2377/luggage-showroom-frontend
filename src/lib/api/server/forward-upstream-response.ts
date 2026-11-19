import "server-only";

const RESPONSE_HEADERS = [
  "content-type",
  "content-disposition",
  "content-language",
  "etag",
  "last-modified",
  "vary",
  "retry-after",
  "www-authenticate",
  "x-request-id",
] as const;

const NULL_BODY_STATUSES = new Set([204, 205, 304]);

type ForwardUpstreamResponseOptions = {
  upstream: Response;
  requestMethod: string;
};

export function forwardUpstreamResponse({
  upstream,
  requestMethod,
}: ForwardUpstreamResponseOptions): Response {
  if (upstream.status === 101) {
    void upstream.body?.cancel().catch(() => undefined);
    throw new Error("Protocol switching is not supported by this proxy.");
  }

  const headers = new Headers();

  for (const name of RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);

    if (value !== null) {
      headers.set(name, value);
    }
  }

  headers.set("cache-control", "private, no-store");
  headers.set("x-content-type-options", "nosniff");

  const hasNoBody =
    requestMethod.toUpperCase() === "HEAD" ||
    NULL_BODY_STATUSES.has(upstream.status);

  if (hasNoBody) {
    void upstream.body?.cancel().catch(() => undefined);
  }

  return new Response(hasNoBody ? null : upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}