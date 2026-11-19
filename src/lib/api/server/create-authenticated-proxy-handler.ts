import "server-only";

import { isApiError } from "../errors/api-error";
import { fetchAuthenticatedUpstream } from "./fetch-authenticated-upstream";
import { forwardUpstreamResponse } from "./forward-upstream-response";

type ProxyContext = {
    params: Promise<{
        path?: string[];
    }>;
};

const ERROR_HEADERS = {
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
} as const;

const GENERIC_ERROR_MESSAGE = "Unable to communicate with the backend service.";

function isAbortError(error: unknown): boolean {
    return error instanceof Error && error.name === "AbortError";
}

function toErrorResponse(error: unknown): Response {
    if (isAbortError(error)) {
        return new Response(null, {
            status: 499,
            headers: ERROR_HEADERS,
        });
    }

    if (isApiError(error)) {
        if (error.isServerError) {
            console.error("[authenticated-proxy]", {
                code: error.code,
                status: error.status,
                cause: error.cause,
            });
        }

        return Response.json(
            {
                detail: error.isClientError ? error.message : GENERIC_ERROR_MESSAGE,
                ...(error.code !== undefined && { code: error.code }),
            },
            {
                status: error.status,
                headers: ERROR_HEADERS,
            },
        );
    }

    console.error("[authenticated-proxy]", {
        code: "UPSTREAM_UNAVAILABLE",
        status: 502,
        cause: error,
    });

    return Response.json(
        {
            detail: GENERIC_ERROR_MESSAGE,
            code: "UPSTREAM_UNAVAILABLE",
        },
        {
            status: 502,
            headers: ERROR_HEADERS,
        },
    );
}

export function createAuthenticatedProxyHandler() {
    return async (
        request: Request,
        context: ProxyContext,
    ): Promise<Response> => {
        try {
            const { path = [] } = await context.params;

            const upstream = await fetchAuthenticatedUpstream({
                path,
                request,
            });

            return forwardUpstreamResponse({
                upstream,
                requestMethod: request.method,
            });
        } catch (error) {
            return toErrorResponse(error);
        }
    };
}