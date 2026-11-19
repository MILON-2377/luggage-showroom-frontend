export type TotpEnrollmentRequest = {
    enrollment_token: string;
};

export type TotpEnrollmentResponse = {
    secret: string;
    provisioning_uri: string;
    expires_at: string;
};