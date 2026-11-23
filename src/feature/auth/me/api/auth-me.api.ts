import { adminFetch } from "@/src/lib/api/client";

import type { AuthUser } from "../types/auth-me.types";

const AUTH_ME_ENDPOINT = "/auth/me";

export function getAuthMe(signal?: AbortSignal): Promise<AuthUser> {
  return adminFetch<AuthUser>(AUTH_ME_ENDPOINT, {
    method: "GET",
    signal,
  });
}