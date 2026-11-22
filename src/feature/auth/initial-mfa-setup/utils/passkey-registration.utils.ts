
import type {
  PasskeyRegistrationOptions,
  SerializedPasskeyRegistrationCredential,
} from "../types/passkey-registration.types";

function decodeBase64Url(value: string): ArrayBuffer {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );

  const binary = window.atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
}

function encodeBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return window
    .btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function buildPasskeyCreationOptions(
  options: PasskeyRegistrationOptions,
): PublicKeyCredentialCreationOptions {
  return {
    ...options,
    challenge: decodeBase64Url(options.challenge),
    user: {
      ...options.user,
      id: decodeBase64Url(options.user.id),
    },
    excludeCredentials: options.excludeCredentials?.map(
      (credential) => ({
        ...credential,
        id: decodeBase64Url(credential.id),
      }),
    ),
  };
}

export async function serializePasskeyRegistrationCredential(
  credential: PublicKeyCredential,
): Promise<SerializedPasskeyRegistrationCredential> {
  if (!(credential.response instanceof AuthenticatorAttestationResponse)) {
    throw new Error(
      "The returned credential is not a valid passkey registration.",
    );
  }

  const response = credential.response;

  return {
    id: credential.id,
    rawId: encodeBase64Url(credential.rawId),
    type: "public-key",
    response: {
      clientDataJSON: encodeBase64Url(response.clientDataJSON),
      attestationObject: encodeBase64Url(response.attestationObject),
      transports:
        typeof response.getTransports === "function"
          ? response.getTransports()
          : undefined,
    },
    clientExtensionResults: credential.getClientExtensionResults(),
    authenticatorAttachment: credential.authenticatorAttachment,
  };
}
