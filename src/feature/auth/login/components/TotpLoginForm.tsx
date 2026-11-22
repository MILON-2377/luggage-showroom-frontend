"use client";

import { useState, type FormEvent } from "react";

import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

type TotpLoginFormProps = {
  onSubmit: (code: string) => Promise<void>;
  onBack: () => void;
  isPending: boolean;
  errorMessage?: string;
};

const CODE_LENGTH = 6;

export function TotpLoginForm({
  onSubmit,
  onBack,
  isPending,
  errorMessage,
}: TotpLoginFormProps) {
  const [code, setCode] = useState("");

  const isValidCode = /^\d{6}$/.test(code);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValidCode) {
      return;
    }

    await onSubmit(code);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="totp-code"
            className="text-[11px] font-semibold tracking-[0.2em] text-[var(--secondary)] uppercase"
          >
            Passcode
          </Label>
          <span className="font-mono text-[11px] tracking-[0.14em] text-[var(--muted-foreground)]">
            {code.length}/{CODE_LENGTH}
          </span>
        </div>

        <Input
          id="totp-code"
          name="totp-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          pattern="\d{6}"
          maxLength={CODE_LENGTH}
          placeholder="••••••"
          value={code}
          onChange={(event) =>
            setCode(
              event.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH),
            )
          }
          required
          disabled={isPending}
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby={errorMessage ? "totp-login-error" : undefined}
          className="h-14 rounded-none border-[var(--input)] bg-[var(--surface-muted)] px-4 text-center font-mono text-2xl font-medium tracking-[0.55em] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50 focus-visible:border-[var(--primary)] focus-visible:bg-[var(--surface)] focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
        />

        <p className="font-mono text-[11px] text-[var(--muted-foreground)]">
          Codes refresh every 30 seconds in your authenticator app.
        </p>
      </div>

      {errorMessage && (
        <Alert
          variant="destructive"
          role="alert"
          id="totp-login-error"
          className="rounded-none border-[var(--destructive)] bg-[var(--destructive)]/8 text-[var(--destructive)]"
        >
          <AlertDescription className="text-xs font-medium tracking-[0.01em] text-[var(--destructive)]">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <Button
          type="submit"
          disabled={isPending || !isValidCode}
          className="h-12 w-full rounded-none border border-[var(--primary)] bg-[var(--primary)] text-xs font-semibold tracking-[0.2em] text-[var(--primary-foreground)] uppercase transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] disabled:border-[var(--border)] disabled:bg-[var(--muted)] disabled:text-[var(--muted-foreground)] disabled:opacity-100"
        >
          {isPending ? "Verifying..." : "Verify & Sign In"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isPending}
          className="h-11 w-full rounded-none border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold tracking-[0.18em] text-[var(--foreground)] uppercase transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] disabled:opacity-50"
        >
          Back to Verification Methods
        </Button>
      </div>
    </form>
  );
}