import { apiFetch } from "@/src/lib/api/client";

import type {
  ResendInitialMfaSetupRequest,
} from "../types/resend-initial-mfa-setup.types";

const RESEND_INITIAL_MFA_SETUP_ENDPOINT =
  "/api/server/admin-setup/initial-mfa-setup/resend";

export function resendInitialMfaSetup(
  payload: ResendInitialMfaSetupRequest,
  signal?: AbortSignal,
): Promise<void> {
  return apiFetch<void>(RESEND_INITIAL_MFA_SETUP_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal,
  });
}