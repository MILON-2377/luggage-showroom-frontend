"use client";

import type { ComponentPropsWithoutRef } from "react";

type FormTextareaProps = ComponentPropsWithoutRef<"textarea">;

export function FormTextarea({
  className = "",
  rows = 4,
  ...rest
}: FormTextareaProps) {
  return (
    <textarea
      rows={rows}
      className={`flex min-h-[88px] w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-colors outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-500 ${className}`}
      {...rest}
    />
  );
}