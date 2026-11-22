"use client";

import { useState, type FormEvent } from "react";

import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

type RecoveryCodeLoginFormProps = {
  onSubmit: (recoveryCode: string) => Promise<void>;
  onBack: () => void;
  isPending: boolean;
  errorMessage?: string;
};

export function RecoveryCodeLoginForm({
  onSubmit,
  onBack,
  isPending,
  errorMessage,
}: RecoveryCodeLoginFormProps) {
  const [recoveryCode, setRecoveryCode] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedCode = recoveryCode.trim();

    if (!normalizedCode) {
      return;
    }

    await onSubmit(normalizedCode);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="recovery-code"
            className="text-[11px] font-semibold tracking-[0.2em] text-[var(--secondary)] uppercase"
          >
            Recovery Key
          </Label>
          <span className="font-mono text-[10px] tracking-[0.16em] text-[var(--accent)] uppercase">
            Single-Use
          </span>
        </div>

        <Input
          id="recovery-code"
          name="recovery-code"
          type="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          autoFocus
          placeholder="XXXX-XXXX"
          value={recoveryCode}
          onChange={(event) => setRecoveryCode(event.target.value)}
          required
          disabled={isPending}
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby={errorMessage ? "recovery-error" : undefined}
          className="h-12 rounded-none border-[var(--input)] bg-[var(--surface-muted)] px-4 font-mono text-sm tracking-[0.2em] text-[var(--foreground)] placeholder:tracking-[0.2em] placeholder:text-[var(--muted-foreground)]/50 focus-visible:border-[var(--primary)] focus-visible:bg-[var(--surface)] focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
        />

        <p className="font-mono text-[11px] text-[var(--muted-foreground)]">
          This key will be permanently invalidated upon verification.
        </p>
      </div>

      {errorMessage && (
        <Alert
          variant="destructive"
          role="alert"
          id="recovery-error"
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
          disabled={isPending || !recoveryCode.trim()}
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