import { apiFetch } from "@/src/lib/api/client";

import type {
  PasskeyLoginOptionsRequest,
  PasskeyLoginOptionsResponse,
} from "../types/admin-login.types";

const PASSKEY_LOGIN_OPTIONS_ENDPOINT =
  "/api/server/admin-setup/login/passkey/options";

export function getPasskeyLoginOptions(
  payload: PasskeyLoginOptionsRequest,
  signal?: AbortSignal,
): Promise<PasskeyLoginOptionsResponse> {
  return apiFetch<PasskeyLoginOptionsResponse>(
    PASSKEY_LOGIN_OPTIONS_ENDPOINT,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal,
    },
  );
}