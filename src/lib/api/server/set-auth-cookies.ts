import "server-only";

import { cookies } from "next/headers";

import { API_CONFIG } from "@/src/config/api";

import { AUTH_COOKIE_OPTIONS } from "./auth-cookie-options";

type SetAuthCookiesOptions = {
    accessToken: string;
    refreshToken: string;
    accessTokenMaxAge: number;
    refreshTokenMaxAge: number;
};

const MAX_TOKEN_LENGTH = 4096;
const MAX_COOKIE_AGE_SECONDS = 60 * 60 * 24 * 400;
const TOKEN_PATTERN = /^[A-Za-z0-9\-._~+/]+=*$/;

function normalizeToken(value: string, label: string): string {
    const token = typeof value === "string" ? value.trim() : "";

    if (!token || token.length > MAX_TOKEN_LENGTH || !TOKEN_PATTERN.test(token)) {
        throw new Error(`Invalid ${label}.`);
    }

    return token;
}

function assertValidMaxAge(value: number, label: string): void {
    if (
        !Number.isSafeInteger(value) ||
        value <= 0 ||
        value > MAX_COOKIE_AGE_SECONDS
    ) {
        throw new Error(`Invalid ${label} expiration.`);
    }
}

export async function setAuthCookies({
    accessToken,
    refreshToken,
    accessTokenMaxAge,
    refreshTokenMaxAge,
}: SetAuthCookiesOptions): Promise<void> {
    const normalizedAccessToken = normalizeToken(accessToken, "access token");
    const normalizedRefreshToken = normalizeToken(refreshToken, "refresh token");

    assertValidMaxAge(accessTokenMaxAge, "access token");
    assertValidMaxAge(refreshTokenMaxAge, "refresh token");

    const cookieStore = await cookies();

    cookieStore.set(API_CONFIG.AUTH.ACCESS_COOKIE, normalizedAccessToken, {
        ...AUTH_COOKIE_OPTIONS,
        maxAge: accessTokenMaxAge,
    });

    cookieStore.set(API_CONFIG.AUTH.REFRESH_COOKIE, normalizedRefreshToken, {
        ...AUTH_COOKIE_OPTIONS,
        maxAge: refreshTokenMaxAge,
    });
}