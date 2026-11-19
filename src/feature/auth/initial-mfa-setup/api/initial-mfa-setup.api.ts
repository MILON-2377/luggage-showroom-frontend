import { apiFetch } from "@/src/lib/api/client";
import type {
    InitialMfaSetupRequest,
    InitialMfaSetupResponse,
} from "../types/initial-mfa-setup.types";

const INITIAL_MFA_SETUP_ENDPOINT =
    "/api/server/admin-setup/initial-mfa-setup";

export function initialMfaSetup(
    payload: InitialMfaSetupRequest,
    signal?: AbortSignal,
): Promise<InitialMfaSetupResponse> {
    return apiFetch<InitialMfaSetupResponse>(INITIAL_MFA_SETUP_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal,
    });
}