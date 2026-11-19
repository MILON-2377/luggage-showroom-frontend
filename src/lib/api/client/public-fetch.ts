import { apiFetch } from "./api-fetch";
import { buildApiPath } from "./build-api-path";

type PublicFetchOptions = Omit<RequestInit, "credentials">;

export function publicFetch<T>(
  path: string,
  options: PublicFetchOptions = {},
): Promise<T> {
  return apiFetch<T>(buildApiPath("PUBLIC", path), {
    ...options,
    credentials: "same-origin",
  });
}