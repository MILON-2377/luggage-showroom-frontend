"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  debounceMs = 300,
  maxLength = 150,
  disabled = false,
  className = "",
  ariaLabel = "Search",
}: SearchInputProps) {
  const [draft, setDraft] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setDraft(value);
  }

  useEffect(() => {
    if (draft === value) return;

    const timer = window.setTimeout(() => {
      onChange(draft);
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [draft, value, debounceMs, onChange]);

  function handleClear() {
    setPrevValue("");
    setDraft("");
    onChange("");
  }

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search
        className="pointer-events-none absolute left-3 size-4 text-[var(--muted-foreground)]"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={draft}
        maxLength={maxLength}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(e) => setDraft(e.target.value.slice(0, maxLength))}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            handleClear();
          }
        }}
        className="pr-8 pl-9"
      />
      {draft.length > 0 && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-1 size-7 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          <X className="size-3.5" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}