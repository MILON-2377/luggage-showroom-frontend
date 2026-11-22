"use client";

import { useMutation } from "@tanstack/react-query";

import { verifyTotpLogin } from "../api/totp-login-verification.api";

import type {
  MfaVerificationResponse,
  TotpLoginVerificationRequest,
} from "../types/admin-login.types";

export function useTotpLoginVerification() {
  return useMutation<
    MfaVerificationResponse,
    Error,
    TotpLoginVerificationRequest
  >({
    mutationFn: (payload) => verifyTotpLogin(payload),
    retry: false,
  });
}