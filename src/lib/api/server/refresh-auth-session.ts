
import "server-only";

import { API_CONFIG } from "@/src/config/api";

import { getApiBaseUrl } from "./api-env";
import { clearAuthCookies } from "./clear-auth-cookies";
import { getRefreshToken } from "./get-refresh-token";

const REFRESH_TIMEOUT_MS = 10_000;
const MAX_TOKEN_LENGTH = 4096;
const TOKEN_PATTERN = /^[A-Za-z0-9\-._~+/]+=*$/;

export type RefreshAuthResult = {
  accessToken: string;
  setCookies: string[];
};

const inflightRefreshes = new Map<
  string,
  Promise<RefreshAuthResult | null>
>();

function trimSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, "");
}

function buildRefreshUrl(): URL {
  const endpoint = [
    trimSlashes(API_CONFIG.API_PREFIX),
    trimSlashes(API_CONFIG.BACKEND.ADMIN),
    trimSlashes(API_CONFIG.AUTH.REFRESH_ENDPOINT),
  ]
    .filter(Boolean)
    .join("/");

  const url = new URL(getApiBaseUrl());
  url.pathname = `/${endpoint}`;

  return url;
}

function getRotatedCookies(
  response: Response,
): RefreshAuthResult | null {
  const getSetCookie = response.headers.getSetCookie;

  if (typeof getSetCookie !== "function") {
    return null;
  }

  const allowedNames = new Set<string>([
    API_CONFIG.AUTH.ACCESS_COOKIE,
    API_CONFIG.AUTH.REFRESH_COOKIE,
  ]);

  const setCookies = getSetCookie
    .call(response.headers)
    .filter((cookie) => {
      const separatorIndex = cookie.indexOf("=");

      if (separatorIndex <= 0) {
        return false;
      }

      const name = cookie.slice(0, separatorIndex).trim();
      const value = cookie
        .slice(separatorIndex + 1)
        .split(";")[0]
        .trim();

      return (
        allowedNames.has(name) &&
        value.length > 0 &&
        value.length <= MAX_TOKEN_LENGTH &&
        TOKEN_PATTERN.test(value) &&
        /;\s*httponly(?:;|$)/i.test(cookie) &&
        /;\s*secure(?:;|$)/i.test(cookie) &&
        /;\s*path=\/(?:;|$)/i.test(cookie) &&
        /;\s*samesite=lax(?:;|$)/i.test(cookie) &&
        !/;\s*domain=/i.test(cookie)
      );
    });

  const accessCookie = setCookies.find((cookie) =>
    cookie.startsWith(`${API_CONFIG.AUTH.ACCESS_COOKIE}=`),
  );

  const refreshCookie = setCookies.find((cookie) =>
    cookie.startsWith(`${API_CONFIG.AUTH.REFRESH_COOKIE}=`),
  );

  if (!accessCookie || !refreshCookie) {
    return null;
  }

  const accessToken = accessCookie
    .slice(accessCookie.indexOf("=") + 1)
    .split(";")[0]
    .trim();

  return {
    accessToken,
    setCookies: [accessCookie, refreshCookie],
  };
}

async function performRefresh(
  refreshToken: string,
): Promise<RefreshAuthResult | null> {
  let response: Response;

  try {
    response = await fetch(buildRefreshUrl(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        Cookie: `${API_CONFIG.AUTH.REFRESH_COOKIE}=${refreshToken}`,
      },
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

  if (response.status !== 204) {
    await response.body?.cancel().catch(() => undefined);
    return null;
  }

  await response.body?.cancel().catch(() => undefined);

  const result = getRotatedCookies(response);

  if (!result) {
    await clearAuthCookies();
  }

  return result;
}

export async function refreshAuthSession(): Promise<RefreshAuthResult | null> {
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
