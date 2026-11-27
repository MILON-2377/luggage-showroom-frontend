"use client";

import type { ReactNode } from "react";

import { Separator } from "@/src/components/ui/seperator";

type FormSectionProps = {
  title: string;
  description?: string;
  badge?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function FormSection({
  title,
  description,
  badge,
  action,
  children,
  className = "",
}: FormSectionProps) {
  return (
    <section
      className={`rounded-xl border border-[var(--border)] bg-[var(--surface)] ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              {title}
            </h2>
            {badge && (
              <span className="rounded-md bg-[var(--surface-muted)] px-2 py-0.5 font-mono text-[10px] font-medium text-[var(--muted-foreground)]">
                {badge}
              </span>
            )}
          </div>

          {description && (
            <p className="text-xs text-[var(--muted-foreground)]">
              {description}
            </p>
          )}
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>

      <Separator className="bg-[var(--border)]" />

      <div className="p-5">{children}</div>
    </section>
  );
}