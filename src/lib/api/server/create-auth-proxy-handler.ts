import "server-only";

import { ApiError, isApiError } from "../errors/api-error";
import { isAuthTokenResponse } from "./auth-token-response";
import { clearAuthCookies } from "./clear-auth-cookies";
import { fetchUpstream } from "./fetch-upstream";
import { forwardUpstreamResponse } from "./forward-upstream-response";
import { setAuthCookies } from "./set-auth-cookies";

type ProxyContext = {
  params: Promise<{
    path?: string[];
  }>;
};

const ERROR_HEADERS = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
} as const;

const GENERIC_ERROR_MESSAGE =
  "Unable to communicate with the backend service.";

const MAX_AUTH_RESPONSE_BYTES = 16 * 1024;
const NULL_BODY_STATUSES = new Set([101, 204, 205, 304]);
const TOKEN_FIELDS = new Set(["access_token", "refresh_token"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasTokenFields(value: unknown): boolean {
  return isRecord(value) && Object.keys(value).some((key) => TOKEN_FIELDS.has(key));
}

function omitTokenFields(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).filter(([key]) => !TOKEN_FIELDS.has(key)),
  );
}

function isLogoutPath(path: string[]): boolean {
  return path[path.length - 1]?.toLowerCase() === "logout";
}

function isJsonResponse(response: Response): boolean {
  const contentType = response.headers.get("content-type") ?? "";

  return /\bapplication\/(?:[\w.-]+\+)?json\b/i.test(contentType);
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

async function discard(response: Response): Promise<void> {
  await response.body?.cancel().catch(() => undefined);
}

async function readBoundedText(response: Response): Promise<string | null> {
  const declaredLength = Number(response.headers.get("content-length"));

  if (Number.isFinite(declaredLength) && declaredLength > MAX_AUTH_RESPONSE_BYTES) {
    await discard(response);
    return null;
  }

  const text = await response.text();

  return text.length > MAX_AUTH_RESPONSE_BYTES ? null : text;
}

function createErrorResponse(error: unknown): Response {
  if (isAbortError(error)) {
    return new Response(null, {
      status: 499,
      headers: ERROR_HEADERS,
    });
  }

  const apiError = isApiError(error)
    ? error
    : new ApiError({
        message: GENERIC_ERROR_MESSAGE,
        status: 502,
        code: "UPSTREAM_UNAVAILABLE",
        cause: error,
      });

  if (apiError.isServerError) {
    console.error("[auth-proxy]", {
      code: apiError.code,
      status: apiError.status,
      cause: apiError.cause,
    });
  }

  return Response.json(
    {
      detail: apiError.isClientError ? apiError.message : GENERIC_ERROR_MESSAGE,
      ...(apiError.code !== undefined && { code: apiError.code }),
    },
    {
      status: apiError.status,
      headers: ERROR_HEADERS,
    },
  );
}

function createInvalidAuthResponse(): Response {
  return Response.json(
    {
      detail: "Invalid authentication response from the backend.",
      code: "INVALID_AUTH_RESPONSE",
    },
    {
      status: 502,
      headers: ERROR_HEADERS,
    },
  );
}

async function handleAuthResponse(
  upstream: Response,
  requestMethod: string,
): Promise<Response> {
  if (
    requestMethod.toUpperCase() === "HEAD" ||
    NULL_BODY_STATUSES.has(upstream.status) ||
    !isJsonResponse(upstream)
  ) {
    return forwardUpstreamResponse({ upstream, requestMethod });
  }

  const text = await readBoundedText(upstream);

  if (text === null) {
    return createInvalidAuthResponse();
  }

  let payload: unknown;

  try {
    payload = JSON.parse(text);
  } catch {
    payload = undefined;
  }

  if (!hasTokenFields(payload)) {
    return forwardUpstreamResponse({
      upstream: new Response(text, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: upstream.headers,
      }),
      requestMethod,
    });
  }

  if (!isAuthTokenResponse(payload)) {
    return createInvalidAuthResponse();
  }

  await setAuthCookies({
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    accessTokenMaxAge: payload.expires_in,
    refreshTokenMaxAge: payload.refresh_expires_in,
  });

  const safePayload = omitTokenFields(payload);

  const forwarded = forwardUpstreamResponse({
    upstream: new Response(null, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: upstream.headers,
    }),
    requestMethod,
  });

  const headers = new Headers(forwarded.headers);

  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "private, no-store");

  return new Response(JSON.stringify(safePayload), {
    status: forwarded.status,
    statusText: forwarded.statusText,
    headers,
  });
}

export function createAuthProxyHandler() {
  return async (
    request: Request,
    context: ProxyContext,
  ): Promise<Response> => {
    let logout = false;

    try {
      const { path = [] } = await context.params;

      logout = isLogoutPath(path);

      const upstream = await fetchUpstream({
        group: "AUTH",
        path,
        request,
      });

      if (logout) {
        await clearAuthCookies();
      }

      if (!upstream.ok) {
        return forwardUpstreamResponse({
          upstream,
          requestMethod: request.method,
        });
      }

      return await handleAuthResponse(upstream, request.method);
    } catch (error) {
      if (logout) {
        await clearAuthCookies().catch(() => undefined);
      }

      return createErrorResponse(error);
    }
  };
}