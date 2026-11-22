import { createProxyHandler } from "@/src/lib/api/server/create-proxy-handler";


const proxyHandler = createProxyHandler("ADMIN");

export async function POST(request: Request) {
  return proxyHandler(request, {
    params: Promise.resolve({
      path: ["auth", "login", "passkey", "verify"],
    }),
  });
}