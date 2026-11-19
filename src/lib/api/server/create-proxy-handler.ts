import "server-only";

import { ApiError, isApiError } from "../errors/api-error";
import type { ApiGroup } from "./build-backend-url";
import { fetchUpstream } from "./fetch-upstream";
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

function toErrorResponse(error: unknown): Response {
    if (error instanceof Error && error.name === "AbortError") {
        return new Response(null, {
            status: 499,
            headers: ERROR_HEADERS,
        });
    }

    const apiError = isApiError(error)
        ? error
        : new ApiError({
            message: "Unable to communicate with the backend service.",
            status: 502,
            code: "UPSTREAM_UNAVAILABLE",
            cause: error,
        });

    if (apiError.isServerError) {
        console.error("[proxy]", {
            code: apiError.code,
            status: apiError.status,
            cause: apiError.cause,
        });
    }

    return Response.json(
        {
            detail: apiError.isClientError
                ? apiError.message
                : "Unable to communicate with the backend service.",
            ...(apiError.code !== undefined && { code: apiError.code }),
        },
        {
            status: apiError.status,
            headers: ERROR_HEADERS,
        },
    );
}

export function createProxyHandler(group: ApiGroup) {
    return async (
        request: Request,
        context: ProxyContext,
    ): Promise<Response> => {
        try {
            const { path = [] } = await context.params;

            const upstream = await fetchUpstream({
                group,
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