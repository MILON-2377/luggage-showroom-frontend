import "server-only";

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

const ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 15;
const REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const isProduction = process.env.NODE_ENV === "production";

export const AUTH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
} as const;

export const ACCESS_TOKEN_COOKIE_OPTIONS = {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
} as const;

export const REFRESH_TOKEN_COOKIE_OPTIONS = {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
} as const;

export const CLEAR_COOKIE_OPTIONS = {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 0,
    expires: new Date(0),
} as const;