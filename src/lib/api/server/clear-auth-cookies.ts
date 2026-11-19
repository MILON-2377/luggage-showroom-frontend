import "server-only";

import { cookies } from "next/headers";

import { API_CONFIG } from "@/src/config/api";

import { CLEAR_COOKIE_OPTIONS } from "./auth-cookie-options";

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(
    API_CONFIG.AUTH.ACCESS_COOKIE,
    "",
    CLEAR_COOKIE_OPTIONS,
  );

  cookieStore.set(
    API_CONFIG.AUTH.REFRESH_COOKIE,
    "",
    CLEAR_COOKIE_OPTIONS,
  );
}