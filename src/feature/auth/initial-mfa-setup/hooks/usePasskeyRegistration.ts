
"use client";

import { useCallback, useRef, useState } from "react";

import { useInitialMfaSetupContext } from "../context/initial-mfa-setup.context";
import { usePasskeyRegistrationOptions } from "./usePasskeyRegistrationOptions";
import { usePasskeyRegistrationVerification } from "./usePasskeyRegistrationVerfication";

import {
  buildPasskeyCreationOptions,
  serializePasskeyRegistrationCredential,
} from "../utils/passkey-registration.utils";

import type {
  PasskeyRegistrationVerificationResponse,
} from "../types/passkey-registration.types";

function isUserCancellation(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === "NotAllowedError" || error.name === "AbortError")
  );
}

export function usePasskeyRegistration() {
  const { enrollmentToken } = useInitialMfaSetupContext();

  const [isPrompting, setIsPrompting] = useState(false);
  const inFlightRef = useRef(false);

  const { mutateAsync: requestOptions, isPending: isOptionsPending } =
    usePasskeyRegistrationOptions();

  const {
    mutateAsync: verifyRegistration,
    isPending: isVerificationPending,
  } = usePasskeyRegistrationVerification();

  const registerPasskey = useCallback(
    async (
      credentialName?: string,
    ): Promise<PasskeyRegistrationVerificationResponse> => {
      if (inFlightRef.current) {
        throw new Error("Passkey registration is already in progress.");
      }

      const token = enrollmentToken?.trim();

      if (!token) {
        throw new Error(
          "Your enrollment session is missing. Please restart setup.",
        );
      }

      if (
        typeof window === "undefined" ||
        !window.isSecureContext ||
        !window.PublicKeyCredential ||
        !navigator.credentials
      ) {
        throw new Error(
          "Passkey registration requires a supported browser and a secure context.",
        );
      }

      inFlightRef.current = true;

      try {
        const optionsResponse = await requestOptions({
          enrollment_token: token,
        });

        const publicKey = buildPasskeyCreationOptions(
          optionsResponse.options,
        );

        setIsPrompting(true);

        let credential: Credential | null;

        try {
          credential = await navigator.credentials.create({
            publicKey,
          });
        } catch (error) {
          if (isUserCancellation(error)) {
            throw new Error("Passkey registration was cancelled.");
          }

          throw error;
        } finally {
          setIsPrompting(false);
        }

        if (!(credential instanceof PublicKeyCredential)) {
          throw new Error("Passkey registration was cancelled or failed.");
        }

        const serializedCredential =
          await serializePasskeyRegistrationCredential(credential);

        return await verifyRegistration({
          enrollment_token: token,
          credential: serializedCredential,
          ...(credentialName?.trim()
            ? { credential_name: credentialName.trim() }
            : {}),
        });
      } finally {
        inFlightRef.current = false;
      }
    },
    [enrollmentToken, requestOptions, verifyRegistration],
  );

  return {
    registerPasskey,
    isPending: isOptionsPending || isPrompting || isVerificationPending,
  };
}
