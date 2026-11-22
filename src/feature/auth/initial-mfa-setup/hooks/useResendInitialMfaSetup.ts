"use client";

import { useMutation } from "@tanstack/react-query";

import { resendInitialMfaSetup } from "../api/resend-initial-mfa-setup.api";
import type {
    ResendInitialMfaSetupRequest,
} from "../types/resend-initial-mfa-setup.types";

export function useResendInitialMfaSetup() {
    return useMutation<void, Error, ResendInitialMfaSetupRequest>({
        mutationFn: (payload) => resendInitialMfaSetup(payload),
        retry: false,
    });
}