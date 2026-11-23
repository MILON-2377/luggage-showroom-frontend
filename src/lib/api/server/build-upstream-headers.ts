
import "server-only";

import { API_CONFIG } from "@/src/config/api";

type BuildUpstreamHeadersOptions = {
  authorization?: string;
  requestId?: string;
};

const FORWARDED_HEADERS = [
  "accept",
  "accept-language",
  "content-type",
] as const;

const MAX_HEADER_VALUE_LENGTH = 2048;
const HEADER_VALUE_PATTERN = /^[\t\x20-\x7e]+$/;
const AUTHORIZATION_PATTERN = /^(Bearer|Basic)\s+\S+$/i;
const REQUEST_ID_PATTERN = /^[A-Za-z0-9._-]{1,128}$/;
const TOKEN_PATTERN = /^[A-Za-z0-9\-._~+/]+=*$/;
const MAX_TOKEN_LENGTH = 4096;

function sanitizeHeaderValue(value: string | null): string | undefined {
  const trimmed = value?.trim();

  if (
    !trimmed ||
    trimmed.length > MAX_HEADER_VALUE_LENGTH ||
    !HEADER_VALUE_PATTERN.test(trimmed)
  ) {
    return undefined;
  }

  return trimmed;
}

function buildAuthCookieHeader(incomingHeaders: Headers): string | undefined {
  const cookieHeader = incomingHeaders.get("cookie");

  if (!cookieHeader) {
    return undefined;
  }

  const allowedCookies = new Set<string>([
  API_CONFIG.AUTH.ACCESS_COOKIE,
  API_CONFIG.AUTH.REFRESH_COOKIE,
]);

  const cookies = new Map<string, string>();

  for (const part of cookieHeader.split(";")) {
    const separatorIndex = part.indexOf("=");

    if (separatorIndex <= 0) {
      continue;
    }

    const name = part.slice(0, separatorIndex).trim();
    const value = part.slice(separatorIndex + 1).trim();

    if (
      !allowedCookies.has(name) ||
      !value ||
      value.length > MAX_TOKEN_LENGTH ||
      !TOKEN_PATTERN.test(value)
    ) {
      continue;
    }

    cookies.set(name, value);
  }

  const forwardedCookies = [...cookies.entries()]
    .map(([name, value]) => `${name}=${value}`);

  return forwardedCookies.length > 0
    ? forwardedCookies.join("; ")
    : undefined;
}

export function buildUpstreamHeaders(
  incomingHeaders: Headers,
  options: BuildUpstreamHeadersOptions = {},
): Headers {
  const headers = new Headers();

  for (const name of FORWARDED_HEADERS) {
    const value = sanitizeHeaderValue(incomingHeaders.get(name));

    if (value) {
      headers.set(name, value);
    }
  }

  const cookie = buildAuthCookieHeader(incomingHeaders);

  if (cookie) {
    headers.set("cookie", cookie);
  }

  const authorization = sanitizeHeaderValue(options.authorization ?? null);

  if (authorization && AUTHORIZATION_PATTERN.test(authorization)) {
    headers.set("authorization", authorization);
  }

  const requestId = options.requestId?.trim();

  if (requestId && REQUEST_ID_PATTERN.test(requestId)) {
    headers.set("x-request-id", requestId);
  }

  return headers;
}
