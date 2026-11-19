import { apiFetch } from "./api-fetch";
import { buildApiPath } from "./build-api-path";

type AdminFetchOptions = Omit<RequestInit, "credentials">;

export function adminFetch<T>(
  path: string,
  options: AdminFetchOptions = {},
): Promise<T> {
  return apiFetch<T>(buildApiPath("ADMIN", path), {
    ...options,
    credentials: "same-origin",
  });
}