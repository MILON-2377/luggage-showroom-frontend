import "server-only";

let cachedBaseUrl: string | undefined;

function resolveBackendBaseUrl(): string {
    const value = process.env.API_BASE_URL?.trim();

    if (!value) {
        throw new Error("API_BASE_URL environment variable is required.");
    }

    let url: URL;

    try {
        url = new URL(value);
    } catch {
        throw new Error("API_BASE_URL must be a valid URL.");
    }

    if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("API_BASE_URL must use the http or https protocol.");
    }

    if (url.username || url.password) {
        throw new Error("API_BASE_URL must not contain credentials.");
    }

    if (url.search || url.hash || url.pathname !== "/") {
        throw new Error("API_BASE_URL must be an origin without path, query or hash.");
    }

    if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
        throw new Error("API_BASE_URL must use HTTPS in production.");
    }

    return url.origin;
}

export function getApiBaseUrl(): string {
    cachedBaseUrl ??= resolveBackendBaseUrl();
    return cachedBaseUrl;
}