"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

import { useInitialMfaSetupContext } from "../context/initial-mfa-setup.context";
import { useTotpEnrollment } from "../hooks/useTotpEnrollment";

type EnrollmentState = "loading" | "ready" | "error";
type CopyState = "idle" | "copied" | "failed";

type Enrollment = {
  secret: string;
  provisioningUri: string;
};

const LOGIN_ROUTE = "/login";
const VERIFY_ROUTE = "/initial-mfa-setup/totp/verify";
const COPY_FEEDBACK_MS = 2_000;
const INVALID = Symbol("invalid-enrollment-session");

const SESSION_INVALID_MESSAGE =
  "Your enrollment session is missing or expired. Please request a new setup link.";
const ENROLLMENT_FAILED_MESSAGE =
  "We couldn't start authenticator enrollment. Your setup session may be invalid, expired, or already used.";

export function TotpEnrollmentPage() {
  const router = useRouter();

  const { enrollmentToken, hasValidEnrollmentSession } =
    useInitialMfaSetupContext();

  const { mutateAsync } = useTotpEnrollment();

  const attemptRef = useRef<
    ReturnType<typeof mutateAsync> | typeof INVALID | null
  >(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [state, setState] = useState<EnrollmentState>("loading");
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [copyState, setCopyState] = useState<CopyState>("idle");

  useEffect(() => {
    let active = true;

    if (attemptRef.current === null) {
      attemptRef.current =
        enrollmentToken && hasValidEnrollmentSession()
          ? mutateAsync({ enrollment_token: enrollmentToken })
          : INVALID;
    }

    const attempt = attemptRef.current;

    if (attempt === INVALID) {
      setErrorMessage(SESSION_INVALID_MESSAGE);
      setState("error");
      return;
    }

    attempt.then(
      (response) => {
        if (!active) return;

        setEnrollment({
          secret: response.secret,
          provisioningUri: response.provisioning_uri,
        });
        setState("ready");
      },
      () => {
        if (!active) return;

        setErrorMessage(ENROLLMENT_FAILED_MESSAGE);
        setState("error");
      },
    );

    return () => {
      active = false;
    };
  }, [enrollmentToken, hasValidEnrollmentSession, mutateAsync]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const copySecret = useCallback(async () => {
    if (!enrollment) return;

    let next: CopyState = "failed";

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(enrollment.secret);
        next = "copied";
      }
    } catch {
      next = "failed";
    }

    setCopyState(next);

    if (copyTimerRef.current) {
      clearTimeout(copyTimerRef.current);
    }

    copyTimerRef.current = setTimeout(() => {
      setCopyState("idle");
    }, COPY_FEEDBACK_MS);
  }, [enrollment]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">Set Up Authenticator</CardTitle>
          <CardDescription>
            Connect an authenticator app to secure your administrator account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {state === "loading" && (
            <div
              className="flex flex-col items-center gap-4 py-10 text-center"
              role="status"
              aria-live="polite"
            >
              <div
                className="size-8 animate-spin rounded-full border-2 border-border border-t-primary"
                aria-hidden="true"
              />
              <p className="text-sm text-muted-foreground">
                Preparing your authenticator enrollment...
              </p>
            </div>
          )}

          {state === "error" && (
            <div className="space-y-4">
              <Alert variant="destructive" role="alert">
                <AlertTitle>Enrollment unavailable</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.replace(LOGIN_ROUTE)}
              >
                Return to login
              </Button>
            </div>
          )}

          {state === "ready" && enrollment && (
            <div className="space-y-6">
              <section className="space-y-2 text-center">
                <h2 className="font-medium">1. Scan the QR code</h2>
                <p className="text-sm text-muted-foreground">
                  Open your authenticator app and scan this QR code.
                </p>
              </section>

              <div className="flex justify-center rounded-lg border bg-white p-5">
                <QRCodeSVG
                  value={enrollment.provisioningUri}
                  size={220}
                  level="M"
                  marginSize={2}
                  role="img"
                  aria-label="Authenticator enrollment QR code"
                />
              </div>

              <section className="space-y-3">
                <h2 className="font-medium">2. Enter the secret manually</h2>

                <p className="text-sm text-muted-foreground">
                  If you cannot scan the QR code, enter this secret manually
                  into your authenticator app.
                </p>

                <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
                  <code
                    className="min-w-0 flex-1 break-all text-sm"
                    translate="no"
                  >
                    {enrollment.secret}
                  </code>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copySecret}
                    className="shrink-0"
                  >
                    {copyState === "copied" ? "Copied" : "Copy"}
                  </Button>
                </div>

                <p
                  className="min-h-5 text-xs text-destructive"
                  role="status"
                  aria-live="polite"
                >
                  {copyState === "failed"
                    ? "Unable to copy the secret. Please copy it manually."
                    : ""}
                </p>
              </section>

              <section className="rounded-lg border bg-muted/30 p-4">
                <h2 className="font-medium">
                  3. Keep your authenticator app ready
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Your authenticator app will generate a time-based
                  verification code. You will use that code in the next
                  verification step.
                </p>
              </section>

              <Button
                type="button"
                className="w-full"
                onClick={() => router.push(VERIFY_ROUTE)}
              >
                Continue to verification
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}