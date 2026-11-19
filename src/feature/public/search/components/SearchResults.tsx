"use client";

import { useLanguage } from "@/src/providers";
import type { SearchProduct } from "../types/search.types";
import SearchResultCard from "./SearchResultCard";

export default function SearchResults({
  items,
  onNavigate,
}: {
  items: SearchProduct[];
  onNavigate?: () => void;
}) {
  const { t } = useLanguage();

  return (
    <section className="mt-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="font-serif text-2xl text-primary">
          {t.search.results}
        </h2>

        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="text-xs tabular-nums text-secondary"
        >
          {t.search.results}: {items.length}
        </p>
      </div>

      <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <SearchResultCard
            key={item.id}
            product={item}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </section>
  );
}