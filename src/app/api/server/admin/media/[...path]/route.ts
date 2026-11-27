import "server-only";

import { createProxyHandler } from "@/src/lib/api/server/create-proxy-handler";

const proxyHandler = createProxyHandler("ADMIN");

type RouteContext = {
    params: Promise<{
        path: string[];
    }>;
};

export async function GET(
    request: Request,
    { params }: RouteContext,
): Promise<Response> {
    return proxyHandler(request, {
        params: params.then(({ path }) => ({
            path: ["media", ...path],
        })),
    });
}

export async function POST(
    request: Request,
    { params }: RouteContext,
): Promise<Response> {
    return proxyHandler(request, {
        params: params.then(({ path }) => ({
            path: ["media", ...path],
        })),
    });
}

export async function DELETE(
    request: Request,
    { params }: RouteContext,
): Promise<Response> {
    return proxyHandler(request, {
        params: params.then(({ path }) => ({
            path: ["media", ...path],
        })),
    });
}