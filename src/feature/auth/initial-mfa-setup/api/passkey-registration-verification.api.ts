import { adminFetch } from "@/src/lib/api/client";

import type {
  PasskeyRegistrationVerificationRequest,
  PasskeyRegistrationVerificationResponse,
} from "../types/passkey-registration.types";

const PASSKEY_REGISTRATION_VERIFICATION_ENDPOINT =
  "mfa/passkey/registration/verify";

export function verifyPasskeyRegistration(
  payload: PasskeyRegistrationVerificationRequest,
): Promise<PasskeyRegistrationVerificationResponse> {
  return adminFetch<PasskeyRegistrationVerificationResponse>(
    PASSKEY_REGISTRATION_VERIFICATION_ENDPOINT,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );
}