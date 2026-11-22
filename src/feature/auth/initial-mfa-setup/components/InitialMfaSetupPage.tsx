"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

import { useInitialMfaSetupContext } from "../context/initial-mfa-setup.context";
import { useInitialMfaSetup } from "../hooks/useInitialMfaSetup";

type SetupStatus = "loading" | "error";

const INVALID_LINK_MESSAGE = "This setup link is invalid or missing its token.";
const SETUP_FAILED_MESSAGE =
  "We couldn't complete the setup request. The link may be invalid, expired, or already used. Please request a new setup link if necessary.";

const PASSKEY_ROUTE = "/initial-mfa-setup/passkey";
const RESEND_ROUTE = "/initial-mfa-setup/resend";

const INVALID = Symbol("invalid-setup-link");

function extractTokenFromHash(): string | null {
  const url = new URL(window.location.href);
  const token = new URLSearchParams(url.hash.slice(1)).get("token")?.trim();

  window.history.replaceState(
    window.history.state,
    "",
    `${url.pathname}${url.search}`,
  );

  return token || null;
}

export function InitialMfaSetupPage() {
  const router = useRouter();

  const [status, setStatus] = useState<SetupStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const { mutateAsync } = useInitialMfaSetup();
  const { setEnrollmentSession } = useInitialMfaSetupContext();

  const attemptRef = useRef<
    ReturnType<typeof mutateAsync> | typeof INVALID | null
  >(null);

  useEffect(() => {
    let active = true;

    if (attemptRef.current === null) {
      const token = extractTokenFromHash();

      attemptRef.current = token
        ? mutateAsync({ initial_setup_token: token })
        : INVALID;
    }

    const attempt = attemptRef.current;

    if (attempt === INVALID) {
      setStatus("error");
      setErrorMessage(INVALID_LINK_MESSAGE);
      return;
    }

    attempt.then(
      (session) => {
        if (!active) return;

        setEnrollmentSession(session);
        router.replace(PASSKEY_ROUTE);
      },
      () => {
        if (!active) return;

        setStatus("error");
        setErrorMessage(SETUP_FAILED_MESSAGE);
      },
    );

    return () => {
      active = false;
    };
  }, [mutateAsync, router, setEnrollmentSession]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">Initial MFA Setup</CardTitle>
          <CardDescription>
            Secure your administrator account with two-factor authentication.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {status === "loading" ? (
            <div
              className="flex flex-col items-center gap-4 py-8 text-center"
              role="status"
              aria-live="polite"
            >
              <div
                className="size-8 animate-spin rounded-full border-2 border-border border-t-primary"
                aria-hidden="true"
              />
              <p className="text-sm text-muted-foreground">
                Validating your setup link...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert variant="destructive" role="alert">
                <AlertTitle>Setup could not continue</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>

              <div className="text-center">
                <Link
                  href={RESEND_ROUTE}
                  className="text-sm font-medium text-primary underline underline-offset-4 hover:opacity-80"
                >
                  Request a new setup email
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}