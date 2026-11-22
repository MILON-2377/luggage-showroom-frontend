export type AdminMfaMethod =
  | "passkey"
  | "totp"
  | "recovery_code";

export type AdminLoginRequest = {
  email: string;
  password: string;
};

export type AdminLoginResponse = {
  challenge_token: string;
  expires_at: string;
  available_mfa_methods: AdminMfaMethod[];
};

export type PasskeyLoginOptionsRequest = {
  challenge_token: string;
};

export type PasskeyLoginOptionsResponse = {
  public_key: Record<string, unknown>;
};

export type PasskeyLoginVerificationRequest = {
  challenge_token: string;
  credential: Record<string, unknown>;
};

export type MfaVerificationResponse = {
  authenticated: boolean;
  message: string;
};

export type TotpLoginVerificationRequest = {
  challenge_token: string;
  code: string;
};

export type RecoveryCodeLoginVerificationRequest = {
  challenge_token: string;
  recovery_code: string;
};