
import "server-only";

import { fetchUpstream } from "./fetch-upstream";
import { getAccessToken } from "./get-access-token";
import { refreshAuthSession } from "./refresh-auth-session";

type FetchAuthenticatedUpstreamOptions = {
    path: string[];
    request: Request;
    requestId?: string;
    timeoutMs?: number;
};

const REPLAYABLE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

async function discard(response: Response): Promise<void> {
    await response.body?.cancel().catch(() => undefined);
}

export async function fetchAuthenticatedUpstream({
    path,
    request,
    requestId,
    timeoutMs,
}: FetchAuthenticatedUpstreamOptions): Promise<Response> {
    let accessToken = await getAccessToken();
    let refreshedBeforeRequest = false;

    if (!accessToken) {
        accessToken = await refreshAuthSession();
        refreshedBeforeRequest = true;
    }

    const upstream = await fetchUpstream({
        group: "ADMIN",
        path,
        request,
        authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        requestId,
        timeoutMs,
    });

    const method = request.method.toUpperCase();

    if (
        upstream.status !== 401 ||
        refreshedBeforeRequest ||
        !REPLAYABLE_METHODS.has(method) ||
        request.signal.aborted
    ) {
        return upstream;
    }

    const refreshedAccessToken = await refreshAuthSession();

    if (!refreshedAccessToken || request.signal.aborted) {
        return upstream;
    }

    await discard(upstream);

    return fetchUpstream({
        group: "ADMIN",
        path,
        request,
        authorization: `Bearer ${refreshedAccessToken}`,
        requestId,
        timeoutMs,
    });
}
