"use client";

import type { ComponentPropsWithoutRef } from "react";
import { ChevronDown } from "lucide-react";

import type { SelectOption } from "../../types/form.types";

type FormSelectProps<T extends string = string> = Omit<
  ComponentPropsWithoutRef<"select">,
  "value" | "onChange"
> & {
  value: T;
  onChange: (value: T) => void;
  options: readonly SelectOption<T>[];
  placeholder?: string;
};

export function FormSelect<T extends string = string>({
  value,
  onChange,
  options,
  placeholder,
  className = "",
  ...rest
}: FormSelectProps<T>) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={`flex h-9 w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--background)] pr-9 pl-3 text-sm text-[var(--foreground)] transition-colors outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-500 ${className}`}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>

      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[var(--muted-foreground)]"
      />
    </div>
  );
}