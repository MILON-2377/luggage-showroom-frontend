"use client";
import { useId } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/lebel";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";
export default function ProductSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useLanguage();
  const c = t.productPage;
  const id = useId();
  return (
    <div>
      <Label
        htmlFor={id}
        className="text-[10px] uppercase tracking-widest text-secondary"
      >
        {c.searchLabel}
      </Label>
      <div className="relative mt-3">
        <Search
          className="pointer-events-none absolute left-3 top-3.5 size-4 text-accent"
          aria-hidden="true"
        />
        <Input
          id={id}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={200}
          placeholder={c.searchPlaceholder}
          className="rounded-xl bg-background pl-10 pr-11"
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange("")}
            aria-label={c.clearSearch}
            className="absolute right-1 top-1 size-9"
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}
