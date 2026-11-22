import { apiFetch } from "@/src/lib/api/client";

import type {
    TotpVerificationRequest,
    TotpVerificationResponse,
} from "../types/totp-verification.types";

const TOTP_VERIFICATION_ENDPOINT =
    "/api/server/admin-setup/initial-mfa-setup/totp/verify";

export function verifyTotp(
    payload: TotpVerificationRequest,
    signal?: AbortSignal,
): Promise<TotpVerificationResponse> {
    return apiFetch<TotpVerificationResponse>(TOTP_VERIFICATION_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal,
    });
}