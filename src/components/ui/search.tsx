"use client";

import { useId, useRef } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

export interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  clearLabel: string;
  submitLabel: string;
  placeholder?: string;
  onSubmit?: (value: string) => void;
  showSubmit?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function Search({
  value,
  onChange,
  label,
  clearLabel,
  submitLabel,
  placeholder,
  onSubmit,
  showSubmit = true,
  disabled = false,
  autoFocus = false,
  className,
}: SearchProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      role="search"
      aria-label={label}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(value.trim());
      }}
      className={cn(
        "flex items-center gap-2 rounded-2xl border border-accent/20",
        "bg-surface p-2 shadow-[0_12px_35px_-20px_rgba(23,23,23,0.3)]",
        "focus-within:border-accent/60 focus-within:ring-2",
        "focus-within:ring-accent/10",
        className,
      )}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>

      <SearchIcon
        className="ml-2 size-5 shrink-0 text-accent"
        strokeWidth={1.5}
        aria-hidden="true"
      />

      <Input
        ref={inputRef}
        id={id}
        type="search"
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        autoComplete="off"
        enterKeyHint="search"
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 [&::-webkit-search-cancel-button]:appearance-none"
      />

      {value && (
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          aria-label={clearLabel}
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          className="shrink-0 rounded-xl"
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      )}

      {showSubmit && (
        <Button
          type="submit"
          disabled={disabled}
          className="shrink-0 rounded-xl px-4"
        >
          <SearchIcon className="size-4 sm:hidden" aria-hidden="true" />
          <span className="hidden sm:inline">{submitLabel}</span>
          <span className="sr-only sm:hidden">{submitLabel}</span>
        </Button>
      )}
    </form>
  );
}