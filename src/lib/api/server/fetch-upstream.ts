import "server-only";

import { randomUUID } from "node:crypto";

import { ApiError } from "../errors/api-error";
import { buildBackendUrl, type ApiGroup } from "./build-backend-url";
import { buildUpstreamHeaders } from "./build-upstream-headers";
import { buildUpstreamRequestInit } from "./build-upstream-request-init";

type FetchUpstreamOptions = {
    group: ApiGroup;
    path: string[];
    request: Request;
    authorization?: string;
    requestId?: string;
    timeoutMs?: number;
};

const REQUEST_ID_PATTERN = /^[A-Za-z0-9._-]{1,128}$/;

function resolveRequestId(request: Request, requestId?: string): string {
    const candidate = requestId ?? request.headers.get("x-request-id")?.trim();

    return candidate && REQUEST_ID_PATTERN.test(candidate)
        ? candidate
        : randomUUID();
}

function toUpstreamError(error: unknown, request: Request): ApiError {
    if (error instanceof ApiError) {
        return error;
    }

    if (error instanceof Error && error.name === "TimeoutError") {
        return new ApiError({
            message: "Upstream request timed out.",
            status: 504,
            code: "UPSTREAM_TIMEOUT",
            cause: error,
        });
    }

    if (request.signal.aborted) {
        return new ApiError({
            message: "Request was aborted by the client.",
            status: 499,
            code: "CLIENT_ABORTED",
            cause: error,
        });
    }

    return new ApiError({
        message: "Upstream request failed.",
        status: 502,
        code: "UPSTREAM_UNAVAILABLE",
        cause: error,
    });
}

export async function fetchUpstream({
    group,
    path,
    request,
    authorization,
    requestId,
    timeoutMs,
}: FetchUpstreamOptions): Promise<Response> {
    let url: URL;

    try {
        url = buildBackendUrl(group, path, new URL(request.url).searchParams);
    } catch (error) {
        throw new ApiError({
            message: "Invalid upstream request.",
            status: 400,
            code: "INVALID_UPSTREAM_REQUEST",
            cause: error,
        });
    }

    const headers = buildUpstreamHeaders(request.headers, {
        authorization,
        requestId: resolveRequestId(request, requestId),
    });

    const init = buildUpstreamRequestInit({
        request,
        headers,
        timeoutMs,
    });

    let response: Response;

    try {
        response = await fetch(url, init);
    } catch (error) {
        throw toUpstreamError(error, request);
    }

    if (response.status >= 300 && response.status < 400 && response.status !== 304) {
        await response.body?.cancel().catch(() => undefined);

        throw new ApiError({
            message: "Upstream returned an unexpected redirect.",
            status: 502,
            code: "UPSTREAM_REDIRECT",
        });
    }

    return response;
}