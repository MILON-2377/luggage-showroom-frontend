"use client";

import { useMutation } from "@tanstack/react-query";

import { verifyTotp } from "../api/totp-verification.api";
import type {
    TotpVerificationRequest,
    TotpVerificationResponse,
} from "../types/totp-verification.types";

export function useTotpVerification() {
    return useMutation<
        TotpVerificationResponse,
        Error,
        TotpVerificationRequest
    >({
        mutationFn: (payload) => verifyTotp(payload),
        retry: false,
    });
}