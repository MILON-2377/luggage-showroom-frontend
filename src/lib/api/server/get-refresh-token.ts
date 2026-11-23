import "server-only";

import { cookies } from "next/headers";

import { API_CONFIG } from "@/src/config/api";

const MAX_TOKEN_LENGTH = 4096;
const TOKEN_PATTERN = /^[A-Za-z0-9\-._~+/]+=*$/;

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();

  const value = cookieStore
    .get(API_CONFIG.AUTH.REFRESH_COOKIE)
    ?.value?.trim();

  if (
    !value ||
    value.length > MAX_TOKEN_LENGTH ||
    !TOKEN_PATTERN.test(value)
  ) {
    return null;
  }

  return value;
}