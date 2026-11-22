"use client";

import { useMutation } from "@tanstack/react-query";

import { verifyPasskeyLogin } from "../api/passkey-login-verification.api";

import type {
  MfaVerificationResponse,
  PasskeyLoginVerificationRequest,
} from "../types/admin-login.types";

export function usePasskeyLoginVerification() {
  return useMutation<
    MfaVerificationResponse,
    Error,
    PasskeyLoginVerificationRequest
  >({
    mutationFn: (payload) => verifyPasskeyLogin(payload),
    retry: false,
  });
}