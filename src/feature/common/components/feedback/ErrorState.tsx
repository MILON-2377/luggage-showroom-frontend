"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Home, RotateCcw } from "lucide-react";

import { Button } from "@/src/components/ui/button";

type ErrorStateProps = {
  title?: string;
  description?: string;
  error?: unknown;
  onRetry?: () => void;
  onBack?: () => void;
  homeHref?: string;
  compact?: boolean;
};

function extractErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  if (typeof error === "string" && error.trim()) {
    return error;
  }
  return null;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred while processing your request.",
  error,
  onRetry,
  onBack,
  homeHref = "/dashboard",
  compact = false,
}: ErrorStateProps) {
  const router = useRouter();
  const detail = extractErrorMessage(error);

  function handleBack() {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  }

  if (compact) {
    return (
      <div
        role="alert"
        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4"
      >
        <div className="flex items-start gap-2.5">
          <AlertTriangle
            className="mt-0.5 size-4 shrink-0 text-red-500"
            aria-hidden="true"
          />
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-red-500">{title}</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              {detail ?? description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRetry && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRetry}
            >
              <RotateCcw className="mr-1.5 size-3.5" aria-hidden="true" />
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center p-6 text-center">
      <div
        role="alert"
        className="w-full max-w-md space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs"
      >
        <div className="mx-auto flex size-11 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-500">
          <AlertTriangle className="size-5" aria-hidden="true" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            {title}
          </h2>
          <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
            {description}
          </p>
          {detail && (
            <p className="mt-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]/60 px-3 py-2 font-mono text-[11px] break-words text-[var(--muted-foreground)]">
              {detail}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          {onRetry && (
            <Button type="button" size="sm" onClick={onRetry}>
              <RotateCcw className="mr-1.5 size-3.5" aria-hidden="true" />
              Try Again
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-1.5 size-3.5" aria-hidden="true" />
            Go Back
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push(homeHref)}
          >
            <Home className="mr-1.5 size-3.5" aria-hidden="true" />
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}