
import "server-only";

import { fetchUpstream } from "./fetch-upstream";
import { getAccessToken } from "./get-access-token";
import { refreshAuthSession } from "./refresh-auth-session";

type FetchAuthenticatedUpstreamOptions = {
  path: string[];
  request: Request;
  requestId?: string;
  timeoutMs?: number;
};

const REPLAYABLE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const NULL_BODY_STATUSES = new Set([204, 205, 304]);

async function discard(response: Response): Promise<void> {
  await response.body?.cancel().catch(() => undefined);
}

function createRequestWithRotatedCookies(
  request: Request,
  setCookies: string[],
): Request {
  const headers = new Headers(request.headers);
  const cookieMap = new Map<string, string>();

  for (const part of (headers.get("cookie") ?? "").split(";")) {
    const separatorIndex = part.indexOf("=");

    if (separatorIndex > 0) {
      cookieMap.set(
        part.slice(0, separatorIndex).trim(),
        part.slice(separatorIndex + 1).trim(),
      );
    }
  }

  for (const cookie of setCookies) {
    const separatorIndex = cookie.indexOf("=");

    if (separatorIndex <= 0) {
      continue;
    }

    const name = cookie.slice(0, separatorIndex).trim();
    const value = cookie
      .slice(separatorIndex + 1)
      .split(";")[0]
      .trim();

    cookieMap.set(name, value);
  }

  headers.set(
    "cookie",
    [...cookieMap.entries()]
      .map(([name, value]) => `${name}=${value}`)
      .join("; "),
  );

  return new Request(request, {
    headers,
    ...(request.body ? { duplex: "half" } : {}),
  } as RequestInit);
}

function attachSetCookies(
  response: Response,
  setCookies: string[],
): Response {
  const headers = new Headers();

  for (const [name, value] of response.headers.entries()) {
    if (name.toLowerCase() !== "set-cookie") {
      headers.append(name, value);
    }
  }

  const getSetCookie = response.headers.getSetCookie;

  if (typeof getSetCookie === "function") {
    for (const cookie of getSetCookie.call(response.headers)) {
      headers.append("set-cookie", cookie);
    }
  }

  for (const cookie of setCookies) {
    headers.append("set-cookie", cookie);
  }

  const hasNullBody = NULL_BODY_STATUSES.has(response.status);

  if (hasNullBody) {
    void discard(response);
  }

  return new Response(hasNullBody ? null : response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function fetchAuthenticatedUpstream({
  path,
  request,
  requestId,
  timeoutMs,
}: FetchAuthenticatedUpstreamOptions): Promise<Response> {
  const accessToken = await getAccessToken();
  let refreshedBeforeRequest = false;
  let refreshedCookies: string[] = [];

  let requestToForward = request;

  if (!accessToken) {
    const refreshResult = await refreshAuthSession();
    refreshedBeforeRequest = true;

    if (refreshResult) {
      refreshedCookies = refreshResult.setCookies;

      requestToForward = createRequestWithRotatedCookies(
        request,
        refreshedCookies,
      );
    }
  }

  const upstream = await fetchUpstream({
    group: "ADMIN",
    path,
    request: requestToForward,
    requestId,
    timeoutMs,
  });

  const method = request.method.toUpperCase();

  if (
    upstream.status !== 401 ||
    refreshedBeforeRequest ||
    !REPLAYABLE_METHODS.has(method) ||
    request.signal.aborted
  ) {
    return refreshedCookies.length > 0
      ? attachSetCookies(upstream, refreshedCookies)
      : upstream;
  }

  const refreshResult = await refreshAuthSession();

  if (!refreshResult || request.signal.aborted) {
    return upstream;
  }

  await discard(upstream);

  const retryRequest = createRequestWithRotatedCookies(
    request,
    refreshResult.setCookies,
  );

  const retriedResponse = await fetchUpstream({
    group: "ADMIN",
    path,
    request: retryRequest,
    requestId,
    timeoutMs,
  });


  return attachSetCookies(
    retriedResponse,
    refreshResult.setCookies,
  );
}
