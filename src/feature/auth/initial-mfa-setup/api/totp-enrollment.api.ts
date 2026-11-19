import { apiFetch } from "@/src/lib/api/client";

import type {
    TotpEnrollmentRequest,
    TotpEnrollmentResponse,
} from "../types/totp-enrollment.types";

const TOTP_ENROLLMENT_ENDPOINT =
    "/api/server/admin-setup/initial-mfa-setup/totp/enroll";

export function enrollTotp(
    payload: TotpEnrollmentRequest,
    signal?: AbortSignal,
): Promise<TotpEnrollmentResponse> {
    return apiFetch<TotpEnrollmentResponse>(TOTP_ENROLLMENT_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal,
    });
}