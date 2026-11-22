"use client";

import { useMutation } from "@tanstack/react-query";

import { requestPasskeyRegistrationOptions } from "../api/passkey-registration-options.api";

import type {
  PasskeyRegistrationOptionsRequest,
  PasskeyRegistrationOptionsResponse,
} from "../types/passkey-registration.types";

export function usePasskeyRegistrationOptions() {
  return useMutation<
    PasskeyRegistrationOptionsResponse,
    Error,
    PasskeyRegistrationOptionsRequest
  >({
    mutationFn: requestPasskeyRegistrationOptions,
    retry: false,
  });
}