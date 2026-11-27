import { adminFetch } from "@/src/lib/api/client";

import type {
  PasskeyRegistrationOptionsRequest,
  PasskeyRegistrationOptionsResponse,
} from "../types/passkey-registration.types";

const PASSKEY_REGISTRATION_OPTIONS_ENDPOINT =
  "mfa/passkey/registration/options";

export function requestPasskeyRegistrationOptions(
  payload: PasskeyRegistrationOptionsRequest,
): Promise<PasskeyRegistrationOptionsResponse> {
  return adminFetch<PasskeyRegistrationOptionsResponse>(
    PASSKEY_REGISTRATION_OPTIONS_ENDPOINT,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );
}