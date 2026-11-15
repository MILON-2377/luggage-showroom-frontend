"use client";
import { X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";
import type { FilterProps } from "../types/product-query.types";
export default function ActiveFilterChips({ query, onChange }: FilterProps) {
  const { t } = useLanguage();
  const c = t.productPage;
  const chips: { key: string; label: string; remove: () => void }[] = [];
  if (query.search)
    chips.push({
      key: "search",
      label: query.search,
      remove: () => onChange({ search: "" }),
    });
  for (const field of ["categories", "materials", "customization"] as const) {
    for (const value of query[field])
      chips.push({
        key: field + value,
        label: c[field].find((v) => v.id === value)?.label || value,
        remove: () =>
          onChange({ [field]: query[field].filter((v) => v !== value) }),
      });
  }
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <Button
          key={chip.key}
          size="sm"
          variant="outline"
          onClick={chip.remove}
          aria-label={c.removeFilter + ": " + chip.label}
          className="max-w-full gap-2 rounded-full text-xs"
        >
          <span className="truncate">{chip.label}</span>
          <X className="size-3" aria-hidden="true" />
        </Button>
      ))}
    </div>
  );
}
