"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/lebel";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";

export default function FaqSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="rounded-3xl border border-accent/20 bg-surface p-5 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.35)] sm:p-7">
      <Label
        htmlFor="faq-search"
        className="text-xs uppercase tracking-[0.15em] text-secondary"
      >
        {t.faq.search.label}
      </Label>

      <div className="relative mt-3">
        <Search
          className="pointer-events-none absolute left-4 top-4 size-5 text-accent"
          aria-hidden="true"
        />

        <Input
          id="faq-search"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t.faq.search.placeholder}
          maxLength={200}
          className="h-13 rounded-xl bg-background pl-12 pr-14"
        />

        {value && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange("")}
            aria-label={t.faq.search.clear}
            className="absolute right-1.5 top-1.5"
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}