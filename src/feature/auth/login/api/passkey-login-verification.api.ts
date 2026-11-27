import { adminFetch } from "@/src/lib/api/client";

import type {
  MfaVerificationResponse,
  PasskeyLoginVerificationRequest,
} from "../types/admin-login.types";

const PASSKEY_LOGIN_VERIFICATION_ENDPOINT = "auth/login/passkey/verify";

export function verifyPasskeyLogin(
  payload: PasskeyLoginVerificationRequest,
  signal?: AbortSignal,
): Promise<MfaVerificationResponse> {
  return adminFetch<MfaVerificationResponse>(
    PASSKEY_LOGIN_VERIFICATION_ENDPOINT,
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