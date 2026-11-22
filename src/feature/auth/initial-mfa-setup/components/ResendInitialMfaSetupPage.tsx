"use client";

import { useState } from "react";

import { useResendInitialMfaSetup } from "../hooks/useResendInitialMfaSetup";

type ResendStatus = "idle" | "success";

export function ResendInitialMfaSetupPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<ResendStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const { mutateAsync, isPending } = useResendInitialMfaSetup();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setErrorMessage("Enter your registered administrator email address.");
      return;
    }

    try {
      await mutateAsync({ email: normalizedEmail });
      setStatus("success");
    } catch {
      setErrorMessage(
        "Request rejected. Wait a moment and submit again.",
      );
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[var(--background)] px-6 py-16 text-[var(--foreground)] selection:bg-[var(--primary)] selection:text-[var(--background)]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(165,139,101,0.12),transparent_58%)]"
      />

      <section className="relative w-full max-w-md border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] shadow-[0_24px_60px_-28px_rgba(23,23,23,0.28)]">
        <div className="h-[3px] w-full bg-[var(--accent)]" />

        {status === "success" ? (
          <div className="space-y-8 p-8 sm:p-10">
            <header className="space-y-3 border-b border-[var(--border)] pb-6">
              <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.26em] text-[var(--accent)] uppercase">
                <span>Dispatch Queued</span>
                <span className="font-mono text-[var(--muted-foreground)]">
                  MFA // LINK
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                Check Your Email
              </h1>

              <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                If an eligible administrator account exists for{" "}
                <span className="font-mono text-[var(--foreground)]">
                  {email.trim().toLowerCase()}
                </span>
                , a new setup link has been dispatched.
              </p>
            </header>

            <div className="border border-[var(--border)] bg-[var(--surface-muted)] p-4">
              <p className="text-xs leading-relaxed text-[var(--secondary)]">
                Setup links are single-use and time-bound. Inspect your inbox
                and spam filters before requesting another dispatch.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEmail("");
                setStatus("idle");
              }}
              className="h-12 w-full border border-[var(--primary)] bg-[var(--primary)] px-4 text-xs font-semibold tracking-[0.2em] text-[var(--primary-foreground)] uppercase transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
            >
              Request Another Link
            </button>
          </div>
        ) : (
          <div className="space-y-8 p-8 sm:p-10">
            <header className="space-y-3 border-b border-[var(--border)] pb-6">
              <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.26em] text-[var(--accent)] uppercase">
                <span>Privileged Access</span>
                <span className="font-mono text-[var(--muted-foreground)]">
                  MFA // SETUP
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                Resend Setup Link
              </h1>

              <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                Provide your registered administrator address to issue a fresh
                MFA enrollment link.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="email"
                    className="text-[11px] font-semibold tracking-[0.2em] text-[var(--secondary)] uppercase"
                  >
                    Administrator Email
                  </label>
                  <span className="font-mono text-[10px] tracking-[0.16em] text-[var(--muted-foreground)] uppercase">
                    Required
                  </span>
                </div>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@domain.com"
                  disabled={isPending}
                  aria-invalid={errorMessage ? true : undefined}
                  aria-describedby={errorMessage ? "resend-error" : undefined}
                  className="h-12 w-full border border-[var(--input)] bg-[var(--surface-muted)] px-4 font-mono text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/60 outline-none transition-colors focus-visible:border-[var(--primary)] focus-visible:bg-[var(--surface)] focus-visible:ring-1 focus-visible:ring-[var(--accent)] disabled:opacity-50"
                />
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  id="resend-error"
                  className="border border-[var(--destructive)] bg-[var(--destructive)]/8 p-3.5 text-xs font-medium tracking-[0.01em] text-[var(--destructive)]"
                >
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending || !email.trim()}
                className="flex h-12 w-full items-center justify-center border border-[var(--primary)] bg-[var(--primary)] px-4 text-xs font-semibold tracking-[0.2em] text-[var(--primary-foreground)] uppercase transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] disabled:cursor-not-allowed disabled:border-[var(--border)] disabled:bg-[var(--muted)] disabled:text-[var(--muted-foreground)]"
              >
                {isPending ? "Dispatching..." : "Dispatch Setup Link"}
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}