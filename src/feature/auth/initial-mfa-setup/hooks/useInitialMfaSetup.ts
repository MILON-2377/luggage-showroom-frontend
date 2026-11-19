"use client";

import { useMutation } from "@tanstack/react-query";

import { initialMfaSetup } from "../api/initial-mfa-setup.api";
import type {
  InitialMfaSetupRequest,
  InitialMfaSetupResponse,
} from "../types/initial-mfa-setup.types";

export function useInitialMfaSetup() {
  return useMutation<
    InitialMfaSetupResponse,
    Error,
    InitialMfaSetupRequest
  >({
    mutationFn: (payload) => initialMfaSetup(payload),
    retry: false,
  });
}