
import "server-only";

import { createProxyHandler } from "@/src/lib/api/server/create-proxy-handler";

const proxyHandler = createProxyHandler("ADMIN");

export async function POST(request: Request): Promise<Response> {
    return proxyHandler(request, {
        params: Promise.resolve({
            path: ["auth", "initial-mfa-setup", "totp", "verify"],
        }),
    });
}
