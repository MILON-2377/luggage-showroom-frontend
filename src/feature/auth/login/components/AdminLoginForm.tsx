"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

import type { AdminLoginRequest } from "../types/admin-login.types";

type AdminLoginFormProps = {
  onSubmit: (payload: AdminLoginRequest) => Promise<void>;
  isPending: boolean;
  errorMessage?: string;
};

export function AdminLoginForm({
  onSubmit,
  isPending,
  errorMessage,
}: AdminLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      email: email.trim(),
      password,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMessage && (
        <Alert
          variant="destructive"
          role="alert"
          id="login-error"
          className="rounded-none border-[var(--destructive)] bg-[var(--destructive)]/8 text-[var(--destructive)]"
        >
          <AlertDescription className="text-xs font-medium tracking-[0.01em] text-[var(--destructive)]">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="admin-email"
            className="text-[11px] font-semibold tracking-[0.2em] text-[var(--secondary)] uppercase"
          >
            Email
          </Label>
          <span className="font-mono text-[10px] tracking-[0.16em] text-[var(--muted-foreground)] uppercase">
            Required
          </span>
        </div>

        <Input
          id="admin-email"
          type="email"
          autoComplete="username"
          placeholder="admin@bagguage.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={isPending}
          className="h-12 rounded-none border-[var(--input)] bg-[var(--surface-muted)] px-4 font-mono text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/60 focus-visible:border-[var(--primary)] focus-visible:bg-[var(--surface)] focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="admin-password"
            className="text-[11px] font-semibold tracking-[0.2em] text-[var(--secondary)] uppercase"
          >
            Password
          </Label>
          <span className="font-mono text-[10px] tracking-[0.16em] text-[var(--muted-foreground)] uppercase">
            {showPassword ? "Visible" : "Masked"}
          </span>
        </div>

        <div className="relative flex items-center">
          <Input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            disabled={isPending}
            aria-invalid={errorMessage ? true : undefined}
            aria-describedby={errorMessage ? "login-error" : undefined}
            className="h-12 rounded-none border-[var(--input)] bg-[var(--surface-muted)] pr-12 pl-4 font-mono text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/60 focus-visible:border-[var(--primary)] focus-visible:bg-[var(--surface)] focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={isPending}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute right-0 flex h-12 w-11 items-center justify-center border-l border-[var(--border)] text-[var(--secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--accent)] disabled:pointer-events-none disabled:opacity-50"
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending || !email.trim() || !password}
        className="h-12 w-full rounded-none border border-[var(--primary)] bg-[var(--primary)] text-xs font-semibold tracking-[0.2em] text-[var(--primary-foreground)] uppercase transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] disabled:border-[var(--border)] disabled:bg-[var(--muted)] disabled:text-[var(--muted-foreground)] disabled:opacity-100"
      >
        {isPending ? "Verifying..." : "Continue"}
      </Button>
    </form>
  );
}