"use client";

import { useMutation } from "@tanstack/react-query";

import { getPasskeyLoginOptions } from "../api/passkey-login-options.api";

import type {
  PasskeyLoginOptionsRequest,
  PasskeyLoginOptionsResponse,
} from "../types/admin-login.types";

export function usePasskeyLoginOptions() {
  return useMutation<
    PasskeyLoginOptionsResponse,
    Error,
    PasskeyLoginOptionsRequest
  >({
    mutationFn: (payload) => getPasskeyLoginOptions(payload),
    retry: false,
  });
}