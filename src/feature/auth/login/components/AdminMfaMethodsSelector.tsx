"use client";

import { ArrowRight, KeyRound, ShieldCheck, Ticket } from "lucide-react";

import type { AdminMfaMethod } from "../types/admin-login.types";

type AdminMfaMethodSelectorProps = {
  methods: AdminMfaMethod[];
  onSelect: (method: AdminMfaMethod) => void;
  isPending: boolean;
};

const METHOD_DETAILS: Record<
  AdminMfaMethod,
  {
    code: string;
    title: string;
    description: string;
    Icon: typeof KeyRound;
  }
> = {
  passkey: {
    code: "FIDO2",
    title: "Passkey",
    description: "Verify via device biometrics, screen lock, or hardware key.",
    Icon: KeyRound,
  },
  totp: {
    code: "TOTP",
    title: "Authenticator App",
    description: "Submit the six-digit challenge from your authenticator.",
    Icon: ShieldCheck,
  },
  recovery_code: {
    code: "VAULT",
    title: "Recovery Code",
    description: "Use an unused single-use backup key from enrollment.",
    Icon: Ticket,
  },
};

export function AdminMfaMethodSelector({
  methods,
  onSelect,
  isPending,
}: AdminMfaMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-[11px] font-semibold tracking-[0.2em] text-[var(--secondary)] uppercase">
        <span>Available Factors</span>
        <span className="font-mono text-[10px] tracking-[0.16em] text-[var(--accent)]">
          {methods.length} {methods.length === 1 ? "METHOD" : "METHODS"}
        </span>
      </div>

      <div className="space-y-2.5" role="group" aria-label="MFA methods">
        {methods.map((method) => {
          const { code, title, description, Icon } = METHOD_DETAILS[method];

          return (
            <button
              key={method}
              type="button"
              disabled={isPending}
              onClick={() => onSelect(method)}
              className="group flex w-full items-center justify-between gap-4 border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-left transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface)] focus-visible:border-[var(--primary)] focus-visible:ring-1 focus-visible:ring-[var(--accent)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <div className="flex items-start gap-3.5">
                <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] transition-colors group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
                  <Icon className="size-4" aria-hidden="true" />
                </span>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold tracking-[0.14em] text-[var(--foreground)] uppercase">
                      {title}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.16em] text-[var(--accent)]">
                       {code}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
                    {description}
                  </p>
                </div>
              </div>

              <ArrowRight
                className="size-4 shrink-0 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}