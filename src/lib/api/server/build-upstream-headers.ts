import "server-only";

type BuildUpstreamHeadersOptions = {
    authorization?: string;
    requestId?: string;
};

const FORWARDED_HEADERS = [
    "accept",
    "accept-language",
    "content-type",
] as const;

const MAX_HEADER_VALUE_LENGTH = 2048;
const HEADER_VALUE_PATTERN = /^[\t\x20-\x7e]+$/;
const AUTHORIZATION_PATTERN = /^(Bearer|Basic)\s+\S+$/i;
const REQUEST_ID_PATTERN = /^[A-Za-z0-9._-]{1,128}$/;

function sanitizeHeaderValue(value: string | null): string | undefined {
    const trimmed = value?.trim();

    if (
        !trimmed ||
        trimmed.length > MAX_HEADER_VALUE_LENGTH ||
        !HEADER_VALUE_PATTERN.test(trimmed)
    ) {
        return undefined;
    }

    return trimmed;
}

export function buildUpstreamHeaders(
    incomingHeaders: Headers,
    options: BuildUpstreamHeadersOptions = {},
): Headers {
    const headers = new Headers();

    for (const name of FORWARDED_HEADERS) {
        const value = sanitizeHeaderValue(incomingHeaders.get(name));

        if (value) {
            headers.set(name, value);
        }
    }

    const authorization = sanitizeHeaderValue(options.authorization ?? null);

    if (authorization && AUTHORIZATION_PATTERN.test(authorization)) {
        headers.set("authorization", authorization);
    }

    const requestId = options.requestId?.trim();

    if (requestId && REQUEST_ID_PATTERN.test(requestId)) {
        headers.set("x-request-id", requestId);
    }

    return headers;
}