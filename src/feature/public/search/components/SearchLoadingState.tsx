"use client";

import { useLanguage } from "@/src/providers";

export default function SearchLoadingState() {
  const { t } = useLanguage();

  return (
    <div role="status" aria-busy="true" className="mt-8">
      <span className="sr-only">{t.search.loading}</span>

      <div
        aria-hidden="true"
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="overflow-hidden rounded-t-[100px] rounded-b-2xl border border-border bg-surface motion-safe:animate-pulse"
          >
            <div className="aspect-[5/4] bg-primary/5" />
            <div className="space-y-4 p-5">
              <div className="h-3 w-1/3 rounded bg-primary/5" />
              <div className="h-7 w-3/4 rounded bg-primary/5" />
              <div className="h-12 rounded bg-primary/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}