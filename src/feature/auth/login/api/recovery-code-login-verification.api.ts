import { adminFetch } from "@/src/lib/api/client";

import type {
  MfaVerificationResponse,
  RecoveryCodeLoginVerificationRequest,
} from "../types/admin-login.types";

const RECOVERY_CODE_LOGIN_VERIFICATION_ENDPOINT =
  "auth/login/recovery-code/verify";

export function verifyRecoveryCodeLogin(
  payload: RecoveryCodeLoginVerificationRequest,
  signal?: AbortSignal,
): Promise<MfaVerificationResponse> {
  return adminFetch<MfaVerificationResponse>(
    RECOVERY_CODE_LOGIN_VERIFICATION_ENDPOINT,
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