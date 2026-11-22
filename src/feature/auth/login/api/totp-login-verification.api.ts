import { apiFetch } from "@/src/lib/api/client";

import type {
  MfaVerificationResponse,
  TotpLoginVerificationRequest,
} from "../types/admin-login.types";

const TOTP_LOGIN_VERIFICATION_ENDPOINT =
  "/api/server/admin-setup/login/totp/verify";

export function verifyTotpLogin(
  payload: TotpLoginVerificationRequest,
  signal?: AbortSignal,
): Promise<MfaVerificationResponse> {
  return apiFetch<MfaVerificationResponse>(
    TOTP_LOGIN_VERIFICATION_ENDPOINT,
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