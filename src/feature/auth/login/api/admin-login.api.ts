import { adminFetch } from "@/src/lib/api/client";

import type {
  AdminLoginRequest,
  AdminLoginResponse,
} from "../types/admin-login.types";

const ADMIN_LOGIN_ENDPOINT = "auth/login";

export function adminLogin(
  payload: AdminLoginRequest,
  signal?: AbortSignal,
): Promise<AdminLoginResponse> {
  return adminFetch<AdminLoginResponse>(ADMIN_LOGIN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal,
  });
}