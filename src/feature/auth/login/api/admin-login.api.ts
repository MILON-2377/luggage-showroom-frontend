import { apiFetch } from "@/src/lib/api/client"; 

import type {
  AdminLoginRequest,
  AdminLoginResponse,
} from "../types/admin-login.types";

const ADMIN_LOGIN_ENDPOINT = "/api/server/admin-setup/login";

export function adminLogin(
  payload: AdminLoginRequest,
  signal?: AbortSignal,
): Promise<AdminLoginResponse> {
  return apiFetch<AdminLoginResponse>(ADMIN_LOGIN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal,
  });
}