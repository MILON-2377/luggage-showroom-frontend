
export type PasskeyRegistrationOptionsRequest = {
  enrollment_token: string;
};

export type PasskeyCredentialDescriptor = {
  id: string;
  type: "public-key";
  transports?: AuthenticatorTransport[];
};

export type PasskeyRegistrationOptions = {
  challenge: string;
  rp: PublicKeyCredentialRpEntity;
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: PublicKeyCredentialParameters[];
  timeout?: number;
  attestation?: AttestationConveyancePreference;
  excludeCredentials?: PasskeyCredentialDescriptor[];
  authenticatorSelection?: AuthenticatorSelectionCriteria;
  extensions?: AuthenticationExtensionsClientInputs;
};


export type PasskeyRegistrationOptionsResponse = {
  options: PasskeyRegistrationOptions;
};


export type SerializedPasskeyRegistrationCredential = {
  id: string;
  rawId: string;
  type: "public-key";
  response: {
    clientDataJSON: string;
    attestationObject: string;
    transports?: string[];
  };
  clientExtensionResults: AuthenticationExtensionsClientOutputs;
  authenticatorAttachment?: string | null;
};


export type PasskeyRegistrationVerificationRequest = {
  enrollment_token: string;
  credential: SerializedPasskeyRegistrationCredential;
  credential_name?: string;
};


export type PasskeyRegistrationVerificationResponse = {
  credential_id: string;
  credential_name: string;
};
