import { apiFetch } from "./api-fetch";
import { buildApiPath } from "./build-api-path";

type AuthFetchOptions = Omit<RequestInit, "credentials">;

export function authFetch<T>(
  path: string,
  options: AuthFetchOptions = {},
): Promise<T> {
  return apiFetch<T>(buildApiPath("AUTH", path), {
    ...options,
    credentials: "same-origin",
  });
}