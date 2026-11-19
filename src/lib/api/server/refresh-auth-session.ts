import "server-only";

import { API_CONFIG } from "@/src/config/api";

import { getApiBaseUrl } from "./api-env";
import { isAuthTokenResponse } from "./auth-token-response";
import { clearAuthCookies } from "./clear-auth-cookies";
import { getRefreshToken } from "./get-refresh-token";
import { setAuthCookies } from "./set-auth-cookies";

const REFRESH_TIMEOUT_MS = 10_000;
const MAX_RESPONSE_BYTES = 16 * 1024;

const inflightRefreshes = new Map<string, Promise<string | null>>();

function trimSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, "");
}

function buildRefreshUrl(): URL {
  const endpoint = [
    trimSlashes(API_CONFIG.API_PREFIX),
    trimSlashes(API_CONFIG.AUTH.REFRESH_ENDPOINT),
  ]
    .filter(Boolean)
    .join("/");

  const url = new URL(getApiBaseUrl());
  url.pathname = `/${endpoint}`;

  return url;
}

async function readJsonBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.toLowerCase().includes("application/json")) {
    await response.body?.cancel().catch(() => undefined);
    return null;
  }

  const declaredLength = response.headers.get("content-length");

  if (declaredLength !== null) {
    const length = Number(declaredLength);

    if (
      !Number.isSafeInteger(length) ||
      length < 0 ||
      length > MAX_RESPONSE_BYTES
    ) {
      await response.body?.cancel().catch(() => undefined);
      return null;
    }
  }

  if (!response.body) {
    return null;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      totalBytes += value.byteLength;

      if (totalBytes > MAX_RESPONSE_BYTES) {
        await reader.cancel().catch(() => undefined);
        return null;
      }

      chunks.push(value);
    }

    const body = new Uint8Array(totalBytes);
    let offset = 0;

    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }

    return JSON.parse(new TextDecoder().decode(body));
  } catch {
    await reader.cancel().catch(() => undefined);
    return null;
  } finally {
    reader.releaseLock();
  }
}

async function performRefresh(
  refreshToken: string,
): Promise<string | null> {
  let response: Response;

  try {
    response = await fetch(buildRefreshUrl(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(REFRESH_TIMEOUT_MS),
    });
  } catch {
    return null;
  }

  if (response.status === 401 || response.status === 403) {
    await response.body?.cancel().catch(() => undefined);
    await clearAuthCookies();
    return null;
  }

  if (!response.ok) {
    await response.body?.cancel().catch(() => undefined);
    return null;
  }

  const data = await readJsonBody(response);

  if (!isAuthTokenResponse(data)) {
    return null;
  }

  try {
    await setAuthCookies({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      accessTokenMaxAge: data.expires_in,
      refreshTokenMaxAge: data.refresh_expires_in,
    });
  } catch {
    return null;
  }

  return data.access_token;
}

export async function refreshAuthSession(): Promise<string | null> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  const existing = inflightRefreshes.get(refreshToken);

  if (existing) {
    return existing;
  }

  const refresh = performRefresh(refreshToken).finally(() => {
    inflightRefreshes.delete(refreshToken);
  });

  inflightRefreshes.set(refreshToken, refresh);

  return refresh;
}