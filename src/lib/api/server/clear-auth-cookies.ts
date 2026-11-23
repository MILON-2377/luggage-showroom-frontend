
import "server-only";

import { cookies } from "next/headers";

import { API_CONFIG } from "@/src/config/api";

const CLEAR_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
  maxAge: 0,
  expires: new Date(0),
} as const;

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(API_CONFIG.AUTH.ACCESS_COOKIE, "", CLEAR_COOKIE_OPTIONS);
  cookieStore.set(API_CONFIG.AUTH.REFRESH_COOKIE, "", CLEAR_COOKIE_OPTIONS);
}
