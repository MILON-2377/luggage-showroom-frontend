"use client";

import type { ReactNode } from "react";

import { Button } from "@/src/components/ui/button";

type FormActionsProps = {
  submitLabel: string;
  isSubmitting?: boolean;
  onCancel?: () => void;
  cancelLabel?: string;
  secondaryAction?: ReactNode;
  statusText?: string;
};

export function FormActions({
  submitLabel,
  isSubmitting = false,
  onCancel,
  cancelLabel = "Cancel",
  secondaryAction,
  statusText,
}: FormActionsProps) {
  return (
    <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 px-5 py-3.5 shadow-sm backdrop-blur-sm">
      <div className="text-xs text-[var(--muted-foreground)]">
        {isSubmitting ? "Saving changes..." : statusText ?? ""}
      </div>

      <div className="flex items-center gap-2.5">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
        )}

        {secondaryAction}

        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}