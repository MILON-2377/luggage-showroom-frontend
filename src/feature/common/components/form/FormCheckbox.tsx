"use client";

import { useId } from "react";

import { Label } from "@/src/components/ui/label";

type FormCheckboxProps = {
  id?: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

export function FormCheckbox({
  id,
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: FormCheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <Label
      htmlFor={checkboxId}
      className={`flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]/40 px-3.5 py-2.5 transition-colors hover:border-[var(--accent)]/50 ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      <input
        id={checkboxId}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 shrink-0 rounded border-[var(--border)] accent-[var(--accent)]"
      />

      <span className="space-y-0.5">
        <span className="block text-xs font-medium text-[var(--foreground)]">
          {label}
        </span>
        {description && (
          <span className="block text-[11px] font-normal text-[var(--muted-foreground)]">
            {description}
          </span>
        )}
      </span>
    </Label>
  );
}