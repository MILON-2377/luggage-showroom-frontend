"use client";

import { KeyRound } from "lucide-react";

import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";

type PasskeyLoginFormProps = {
  onSubmit: () => Promise<void>;
  onBack: () => void;
  isPending: boolean;
  errorMessage?: string;
};

export function PasskeyLoginForm({
  onSubmit,
  onBack,
  isPending,
  errorMessage,
}: PasskeyLoginFormProps) {
  async function handleSubmit() {
    await onSubmit();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-semibold tracking-[0.2em] text-[var(--secondary)] uppercase">
          <span>Authenticator Status</span>
          <span className="font-mono text-[10px] tracking-[0.16em] text-[var(--accent)]">
            {isPending ? "PENDING" : "READY"}
          </span>
        </div>

        <div className="flex items-center gap-3.5 border border-[var(--border)] bg-[var(--surface-muted)] p-4">
          <span className="inline-flex size-10 shrink-0 items-center justify-center border border-[var(--accent)] bg-[var(--surface)] text-[var(--accent)]">
            <KeyRound className="size-4" aria-hidden="true" />
          </span>
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-[var(--foreground)] uppercase">
              Hardware / Biometric Prompt
            </p>
            <p className="font-mono text-[11px] text-[var(--muted-foreground)]">
              {isPending
                ? "Awaiting authenticator response..."
                : "Ready for cryptographic assertion"}
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <Alert
          variant="destructive"
          role="alert"
          className="rounded-none border-[var(--destructive)] bg-[var(--destructive)]/8 text-[var(--destructive)]"
        >
          <AlertDescription className="text-xs font-medium tracking-[0.01em] text-[var(--destructive)]">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="h-12 w-full rounded-none border border-[var(--primary)] bg-[var(--primary)] text-xs font-semibold tracking-[0.2em] text-[var(--primary-foreground)] uppercase transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] disabled:border-[var(--border)] disabled:bg-[var(--muted)] disabled:text-[var(--muted-foreground)] disabled:opacity-100"
        >
          {isPending ? "Awaiting Passkey..." : "Continue with Passkey"}
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
    </div>
  );
}