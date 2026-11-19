"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";

export default function PopularSearches({
  onSelect,
}: {
  onSelect: (value: string) => void;
}) {
  const { t } = useLanguage();

  return (
    <section className="mt-6">
      <h2 className="text-xs font-medium text-secondary">
        {t.search.popular}
      </h2>

      <div className="mt-3 flex flex-wrap gap-2">
        {t.search.popularTerms.map((term) => (
          <Button
            key={term}
            variant="outline"
            size="sm"
            onClick={() => onSelect(term)}
            className="rounded-full border-accent/20"
          >
            {term}
            <ArrowUpRight className="size-3" aria-hidden="true" />
          </Button>
        ))}
      </div>
    </section>
  );
}