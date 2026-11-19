"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";
import type { SearchProduct } from "../types/search.types";

export default function SearchSuggestions({
  items,
  onSelect,
}: {
  items: SearchProduct[];
  onSelect: (value: string) => void;
}) {
  const { t } = useLanguage();
  if (!items.length) return null;

  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xs font-medium text-secondary">
        {t.search.suggestions}
      </h2>

      <div className="flex flex-wrap gap-2">
        {items.slice(0, 4).map((item) => (
          <Button
            key={item.id}
            variant="outline"
            size="sm"
            onClick={() => onSelect(item.name)}
            className="max-w-full rounded-full"
          >
            <span className="truncate">{item.name}</span>
            <ArrowUpRight className="size-3" aria-hidden="true" />
          </Button>
        ))}
      </div>
    </section>
  );
}