import "server-only";

import { createProxyHandler } from "@/src/lib/api/server/create-proxy-handler";

const proxyHandler = createProxyHandler("ADMIN");

type RouteContext = {
    params: Promise<{
        path: string[];
    }>;
};

async function handleRequest(
    request: Request,
    { params }: RouteContext,
): Promise<Response> {
    return proxyHandler(request, {
        params: params.then(({ path }) => ({
            path: ["catalog", ...path],
        })),
    });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
export const HEAD = handleRequest;