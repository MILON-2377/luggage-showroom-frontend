import "server-only";

import { API_CONFIG } from "@/src/config/api";
import { getApiBaseUrl } from "./api-env";

export type ApiGroup = keyof typeof API_CONFIG.BACKEND;

const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;
const ENCODED_UNSAFE_SEQUENCE = /%(?:2e|2f|5c|00)/i;

function trimSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, "");
}

function isApiGroup(group: string): group is ApiGroup {
  return Object.prototype.hasOwnProperty.call(
    API_CONFIG.BACKEND,
    group,
  );
}

function assertSafeSegment(segment: string): void {
  if (
    !segment ||
    segment === "." ||
    segment === ".." ||
    segment.includes("/") ||
    segment.includes("\\") ||
    CONTROL_CHARACTERS.test(segment) ||
    ENCODED_UNSAFE_SEQUENCE.test(segment)
  ) {
    throw new Error("Invalid API path segment.");
  }
}

export function buildBackendUrl(
  group: ApiGroup,
  path: string[],
  searchParams: URLSearchParams,
): URL {
  if (!isApiGroup(group)) {
    throw new Error("Invalid API group.");
  }

  if (!Array.isArray(path)) {
    throw new Error("Invalid API path.");
  }

  if (!(searchParams instanceof URLSearchParams)) {
    throw new Error("Invalid API search parameters.");
  }

  path.forEach(assertSafeSegment);

  const backendPath = [
    trimSlashes(API_CONFIG.API_PREFIX),
    trimSlashes(API_CONFIG.BACKEND[group]),
    ...path.map((segment) => encodeURIComponent(segment)),
  ]
    .filter(Boolean)
    .join("/");

  const url = new URL(getApiBaseUrl());

  url.pathname = `/${backendPath}`;

  searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  return url;
}