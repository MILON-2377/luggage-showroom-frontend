import { adminFetch } from "@/src/lib/api/client";

import type {
  TotpEnrollmentRequest,
  TotpEnrollmentResponse,
} from "../types/totp-enrollment.types";

const TOTP_ENROLLMENT_ENDPOINT =
  "initial-mfa-setup/totp/enroll";

export function enrollTotp(
  payload: TotpEnrollmentRequest,
  signal?: AbortSignal,
): Promise<TotpEnrollmentResponse> {
  return adminFetch<TotpEnrollmentResponse>(
    TOTP_ENROLLMENT_ENDPOINT,
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