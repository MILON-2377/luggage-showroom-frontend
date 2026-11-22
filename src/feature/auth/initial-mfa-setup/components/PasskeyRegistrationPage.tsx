
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

import { Alert, AlertDescription } from "@/src/components/ui/alert";

import { PasskeyRegistrationForm } from "./PasskeyRegistrationForm";
import { usePasskeyRegistration } from "../hooks/usePasskeyRegistration";

const TOTP_ROUTE = "/initial-mfa-setup/totp";

export function PasskeyRegistrationPage() {
  const router = useRouter();

  const { registerPasskey, isPending } = usePasskeyRegistration();

  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(credentialName?: string): Promise<void> {
    setErrorMessage("");

    try {
      await registerPasskey(credentialName);

      router.replace(TOTP_ROUTE);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to register your passkey. Please try again.",
      );
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">
            Register Your Passkey
          </CardTitle>

          <CardDescription>
            Complete the first step of your mandatory administrator MFA setup.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <Alert>
            <AlertDescription>
              Passkey registration is required before continuing to
              authenticator setup.
            </AlertDescription>
          </Alert>

          <PasskeyRegistrationForm
            onSubmit={handleSubmit}
            isPending={isPending}
            errorMessage={errorMessage}
          />
        </CardContent>
      </Card>
    </main>
  );
}
