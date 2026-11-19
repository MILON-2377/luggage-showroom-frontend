export type AuthTokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: "Bearer";
  expires_in: number;
  refresh_expires_in: number;
};

const MAX_TOKEN_LENGTH = 4096;
const MAX_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 400;
const TOKEN_PATTERN = /^[A-Za-z0-9\-._~+/]+=*$/;

function isValidToken(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= MAX_TOKEN_LENGTH &&
    TOKEN_PATTERN.test(value)
  );
}

function isValidExpiresIn(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value > 0 &&
    value <= MAX_EXPIRES_IN_SECONDS
  );
}

export function isAuthTokenResponse(
  value: unknown,
): value is AuthTokenResponse {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const data = value as Record<string, unknown>;

  return (
    isValidToken(data.access_token) &&
    isValidToken(data.refresh_token) &&
    typeof data.token_type === "string" &&
    data.token_type.toLowerCase() === "bearer" &&
    isValidExpiresIn(data.expires_in) &&
    isValidExpiresIn(data.refresh_expires_in)
  );
}