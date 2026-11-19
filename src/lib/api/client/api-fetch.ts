import { ApiError } from "../errors/api-error";

const NETWORK_ERROR_STATUS = 503;
const NO_BODY_STATUSES = new Set([204, 205, 304]);

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAbortError(error: unknown): boolean {
    return (
        (error instanceof DOMException || error instanceof Error) &&
        error.name === "AbortError"
    );
}

function isJsonContentType(contentType: string): boolean {
    const normalized = contentType.toLowerCase();

    return (
        normalized.includes("application/json") || normalized.includes("+json")
    );
}

function getErrorMessage(payload: unknown, fallback: string): string {
    if (typeof payload === "string" && payload.trim()) {
        return payload.trim().slice(0, 500);
    }

    if (!isRecord(payload)) {
        return fallback;
    }

    for (const value of [payload.detail, payload.message, payload.error]) {
        if (typeof value === "string" && value.trim()) {
            return value;
        }
    }

    return fallback;
}

async function parseResponseBody(
    response: Response,
    method: string,
): Promise<unknown> {
    if (method === "HEAD" || NO_BODY_STATUSES.has(response.status)) {
        return undefined;
    }

    let text: string;

    try {
        text = await response.text();
    } catch (error) {
        if (isAbortError(error)) {
            throw error;
        }

        return undefined;
    }

    if (!text.trim()) {
        return undefined;
    }

    if (isJsonContentType(response.headers.get("content-type") ?? "")) {
        try {
            return JSON.parse(text);
        } catch {
            return response.ok ? undefined : text;
        }
    }

    return text;
}

export async function apiFetch<T>(
    input: RequestInfo | URL,
    init: RequestInit = {},
): Promise<T> {
    const headers = new Headers(init.headers);
    const method = (init.method ?? "GET").toUpperCase();

    if (!headers.has("Accept")) {
        headers.set("Accept", "application/json");
    }

    let response: Response;

    try {
        response = await fetch(input, {
            ...init,
            headers,
            credentials: "same-origin",
            cache: init.cache ?? "no-store",
        });
    } catch (error) {
        if (isAbortError(error)) {
            throw error;
        }

        throw new ApiError({
            message: "Unable to connect to the server.",
            status: NETWORK_ERROR_STATUS,
            code: "NETWORK_ERROR",
            cause: error,
        });
    }

    const payload = await parseResponseBody(response, method);

    if (!response.ok) {
        const errorPayload = isRecord(payload) ? payload : undefined;

        throw new ApiError({
            message: getErrorMessage(
                payload,
                response.statusText || "An unexpected API error occurred.",
            ),
            status: response.status,
            code:
                typeof errorPayload?.code === "string" ? errorPayload.code : undefined,
            details: errorPayload?.errors ?? payload,
        });
    }

    return payload as T;
}