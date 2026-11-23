
import { adminFetch } from "@/src/lib/api/client";

const LOGOUT_ENDPOINT = "/auth/logout";

export function logout(signal?: AbortSignal): Promise<void> {
  return adminFetch<void>(LOGOUT_ENDPOINT, {
    method: "POST",
    signal,
  });
}
