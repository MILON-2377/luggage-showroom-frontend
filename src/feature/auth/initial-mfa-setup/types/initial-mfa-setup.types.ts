export type InitialMfaSetupRequest = {
    initial_setup_token: string;
};

export type InitialMfaSetupResponse = {
    enrollment_token: string;
};