"use client";

import { useMutation } from "@tanstack/react-query";

import { verifyPasskeyRegistration } from "../api/passkey-registration-verification.api";

import type {
  PasskeyRegistrationVerificationRequest,
  PasskeyRegistrationVerificationResponse,
} from "../types/passkey-registration.types";

export function usePasskeyRegistrationVerification() {
  return useMutation<
    PasskeyRegistrationVerificationResponse,
    Error,
    PasskeyRegistrationVerificationRequest
  >({
    mutationFn: verifyPasskeyRegistration,
    retry: false,
  });
}