"use client";

import { History } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";

export default function RecentSearches({
  items,
  onSelect,
  onClear,
}: {
  items: string[];
  onSelect: (value: string) => void;
  onClear: () => void;
}) {
  const { t } = useLanguage();
  if (!items.length) return null;

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xs font-medium text-secondary">
          <History className="size-4 text-accent" aria-hidden="true" />
          {t.search.recent}
        </h2>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-xs"
        >
          {t.search.clearHistory}
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <Button
            key={item}
            variant="outline"
            size="sm"
            onClick={() => onSelect(item)}
            className="max-w-full rounded-full"
          >
            <span className="truncate">{item}</span>
          </Button>
        ))}
      </div>
    </section>
  );
}