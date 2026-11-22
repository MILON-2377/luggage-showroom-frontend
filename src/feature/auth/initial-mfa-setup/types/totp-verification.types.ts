export type TotpVerificationRequest = {
    enrollment_token: string;
    code: string;
};

export type TotpVerificationResponse = {
    recovery_codes: string[];
};