import "server-only";

import { createProxyHandler } from "@/src/lib/api/server/create-proxy-handler";



const handler = createProxyHandler("ADMIN");

export async function POST(
  request: Request,
): Promise<Response> {
  return handler(request, {
    params: Promise.resolve({
      path: ["auth", "login", "totp", "verify"],
    }),
  });
}