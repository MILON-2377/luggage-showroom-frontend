"use client";

import { useMutation } from "@tanstack/react-query";

import { verifyRecoveryCodeLogin } from "../api/recovery-code-login-verification.api";

import type {
  MfaVerificationResponse,
  RecoveryCodeLoginVerificationRequest,
} from "../types/admin-login.types";

export function useRecoveryCodeLoginVerification() {
  return useMutation<
    MfaVerificationResponse,
    Error,
    RecoveryCodeLoginVerificationRequest
  >({
    mutationFn: (payload) => verifyRecoveryCodeLogin(payload),
    retry: false,
  });
}