type PasskeyCredentialDescriptor = {
  id: string;
  type: "public-key";
  transports?: AuthenticatorTransport[];
};

export type PasskeyRequestOptions = {
  challenge: string;
  timeout?: number;
  rpId?: string;
  allowCredentials?: PasskeyCredentialDescriptor[];
  userVerification?: UserVerificationRequirement;
};

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

export function buildPasskeyRequestOptions(
  options: PasskeyRequestOptions,
): PublicKeyCredentialRequestOptions {
  return {
    challenge: decodeBase64Url(options.challenge),
    timeout: options.timeout,
    rpId: options.rpId,
    userVerification: options.userVerification,
    allowCredentials: options.allowCredentials?.map((credential) => ({
      id: decodeBase64Url(credential.id),
      type: credential.type,
      transports: credential.transports,
    })),
  };
}

export function serializePasskeyCredential(
  credential: PublicKeyCredential,
) {
  if (!(credential.response instanceof AuthenticatorAssertionResponse)) {
    throw new Error("The returned credential is not a valid passkey assertion.");
  }

  const response = credential.response;

  return {
    id: credential.id,
    rawId: encodeBase64Url(credential.rawId),
    type: credential.type,
    response: {
      clientDataJSON: encodeBase64Url(response.clientDataJSON),
      authenticatorData: encodeBase64Url(response.authenticatorData),
      signature: encodeBase64Url(response.signature),
      userHandle: response.userHandle
        ? encodeBase64Url(response.userHandle)
        : null,
    },
    clientExtensionResults: credential.getClientExtensionResults(),
  };
}