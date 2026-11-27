"use client";

import { useId, type ReactNode } from "react";

import { Label } from "@/src/components/ui/label";

export type FormFieldRenderProps = {
  id: string;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
};

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: (props: FormFieldRenderProps) => ReactNode;
};

export function FormField({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  className = "",
  children,
}: FormFieldProps) {
  const generatedId = useId();
  const fieldId = htmlFor ?? generatedId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  const describedBy =
    [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-baseline justify-between gap-2">
        <Label
          htmlFor={fieldId}
          className="text-xs font-medium text-[var(--foreground)]"
        >
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 text-[var(--accent)]">
              *
            </span>
          )}
        </Label>

        {hint && !error && (
          <span
            id={hintId}
            className="text-[11px] text-[var(--muted-foreground)]"
          >
            {hint}
          </span>
        )}
      </div>

      {children({
        id: fieldId,
        ...(error ? { "aria-invalid": true } : {}),
        ...(describedBy ? { "aria-describedby": describedBy } : {}),
      })}

      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}