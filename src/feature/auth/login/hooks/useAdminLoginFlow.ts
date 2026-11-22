"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useAdminLogin } from "./useAdminLogin";
import { usePasskeyLoginOptions } from "./usePasskeyLoginOptions";
import { usePasskeyLoginVerification } from "./usePasskeyLoginVerification";
import { useTotpLoginVerification } from "./useTotpLoginVerification";
import { useRecoveryCodeLoginVerification } from "./useRecoveryCodeLoginVerification";

import {
  buildPasskeyRequestOptions,
  serializePasskeyCredential,
} from "../utils/passkey-login.utils";

import type {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminMfaMethod,
  MfaVerificationResponse,
} from "../types/admin-login.types";

const EMPTY_METHODS: AdminMfaMethod[] = [];
const CHALLENGE_MISSING_MESSAGE =
  "Your login challenge is missing. Please sign in again.";

function isUserCancellation(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === "NotAllowedError" || error.name === "AbortError")
  );
}

export function useAdminLoginFlow() {
  const [challenge, setChallenge] = useState<AdminLoginResponse | null>(null);

  const challengeRef = useRef<AdminLoginResponse | null>(null);
  const passkeyInFlightRef = useRef(false);
  const passkeyAbortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  const { mutateAsync: login, isPending: isLoginPending } = useAdminLogin();
  const { mutateAsync: requestPasskeyOptions, isPending: isOptionsPending } =
    usePasskeyLoginOptions();
  const { mutateAsync: verifyPasskeyCredential, isPending: isPasskeyPending } =
    usePasskeyLoginVerification();
  const { mutateAsync: verifyTotpCode, isPending: isTotpPending } =
    useTotpLoginVerification();
  const { mutateAsync: verifyRecoveryCodeValue, isPending: isRecoveryPending } =
    useRecoveryCodeLoginVerification();

  const [isPasskeyPrompting, setIsPasskeyPrompting] = useState(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      passkeyAbortRef.current?.abort();
      passkeyAbortRef.current = null;
    };
  }, []);

  const updateChallenge = useCallback((value: AdminLoginResponse | null) => {
    challengeRef.current = value;

    if (mountedRef.current) {
      setChallenge(value);
    }
  }, []);

  const requireChallenge = useCallback(
    (method: AdminMfaMethod, unavailableMessage: string): AdminLoginResponse => {
      const current = challengeRef.current;

      if (!current) {
        throw new Error(CHALLENGE_MISSING_MESSAGE);
      }

      if (!current.available_mfa_methods.includes(method)) {
        throw new Error(unavailableMessage);
      }

      return current;
    },
    [],
  );

  const submitCredentials = useCallback(
    async (payload: AdminLoginRequest): Promise<AdminLoginResponse> => {
      passkeyAbortRef.current?.abort();
      updateChallenge(null);

      const response = await login(payload);

      updateChallenge(response);

      return response;
    },
    [login, updateChallenge],
  );

  const verifyPasskey = useCallback(async (): Promise<MfaVerificationResponse> => {
    if (passkeyInFlightRef.current) {
      throw new Error("A passkey verification is already in progress.");
    }

    const current = requireChallenge(
      "passkey",
      "Passkey authentication is not available for this account.",
    );

    if (
      typeof window === "undefined" ||
      !window.PublicKeyCredential ||
      !navigator.credentials
    ) {
      throw new Error("This browser does not support passkey authentication.");
    }

    passkeyInFlightRef.current = true;

    const controller = new AbortController();
    passkeyAbortRef.current = controller;

    try {
      const optionsResponse = await requestPasskeyOptions({
        challenge_token: current.challenge_token,
      });

      if (challengeRef.current !== current) {
        throw new Error(CHALLENGE_MISSING_MESSAGE);
      }

      const publicKey = buildPasskeyRequestOptions(
        optionsResponse.public_key as Parameters<
          typeof buildPasskeyRequestOptions
        >[0],
      );

      let credential: Credential | null;

      setIsPasskeyPrompting(true);

      try {
        credential = await navigator.credentials.get({
          publicKey,
          signal: controller.signal,
        });
      } catch (error) {
        if (isUserCancellation(error)) {
          throw new Error("Passkey authentication was cancelled.");
        }

        throw new Error("Passkey authentication failed. Please try again.");
      } finally {
        if (mountedRef.current) {
          setIsPasskeyPrompting(false);
        }
      }

      if (!(credential instanceof PublicKeyCredential)) {
        throw new Error("Passkey authentication was cancelled or failed.");
      }

      if (challengeRef.current !== current) {
        throw new Error(CHALLENGE_MISSING_MESSAGE);
      }

      return await verifyPasskeyCredential({
        challenge_token: current.challenge_token,
        credential: serializePasskeyCredential(credential),
      });
    } finally {
      passkeyInFlightRef.current = false;

      if (passkeyAbortRef.current === controller) {
        passkeyAbortRef.current = null;
      }
    }
  }, [requireChallenge, requestPasskeyOptions, verifyPasskeyCredential]);

  const verifyTotp = useCallback(
    async (code: string): Promise<MfaVerificationResponse> => {
      const current = requireChallenge(
        "totp",
        "Authenticator app verification is not available.",
      );

      const normalized = code.replace(/\s+/g, "");

      if (!/^\d{6}$/.test(normalized)) {
        throw new Error("Enter the 6-digit code from your authenticator app.");
      }

      return verifyTotpCode({
        challenge_token: current.challenge_token,
        code: normalized,
      });
    },
    [requireChallenge, verifyTotpCode],
  );

  const verifyRecoveryCode = useCallback(
    async (recoveryCode: string): Promise<MfaVerificationResponse> => {
      const current = requireChallenge(
        "recovery_code",
        "Recovery-code verification is not available.",
      );

      const normalized = recoveryCode.trim();

      if (!normalized) {
        throw new Error("Enter a recovery code.");
      }

      return verifyRecoveryCodeValue({
        challenge_token: current.challenge_token,
        recovery_code: normalized,
      });
    },
    [requireChallenge, verifyRecoveryCodeValue],
  );

  const resetChallenge = useCallback(() => {
    passkeyAbortRef.current?.abort();
    updateChallenge(null);
  }, [updateChallenge]);

  const availableMfaMethods: AdminMfaMethod[] =
    challenge?.available_mfa_methods ?? EMPTY_METHODS;

  const isPending =
    isLoginPending ||
    isOptionsPending ||
    isPasskeyPending ||
    isPasskeyPrompting ||
    isTotpPending ||
    isRecoveryPending;

  return {
    challenge,
    availableMfaMethods,
    isPending,
    submitCredentials,
    verifyPasskey,
    verifyTotp,
    verifyRecoveryCode,
    resetChallenge,
  };
}