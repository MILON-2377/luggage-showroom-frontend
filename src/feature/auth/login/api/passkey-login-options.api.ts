import { adminFetch } from "@/src/lib/api/client";

import type {
  PasskeyLoginOptionsRequest,
  PasskeyLoginOptionsResponse,
} from "../types/admin-login.types";

const PASSKEY_LOGIN_OPTIONS_ENDPOINT = "auth/login/passkey/options";

export function getPasskeyLoginOptions(
  payload: PasskeyLoginOptionsRequest,
  signal?: AbortSignal,
): Promise<PasskeyLoginOptionsResponse> {
  return adminFetch<PasskeyLoginOptionsResponse>(
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