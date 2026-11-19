"use client";

import { useMutation } from "@tanstack/react-query";

import { enrollTotp } from "../api/totp-enrollment.api";
import type {
    TotpEnrollmentRequest,
    TotpEnrollmentResponse,
} from "../types/totp-enrollment.types";

export function useTotpEnrollment() {
    return useMutation<
        TotpEnrollmentResponse,
        Error,
        TotpEnrollmentRequest
    >({
        mutationFn: (payload) => enrollTotp(payload),
        retry: false,
    });
}