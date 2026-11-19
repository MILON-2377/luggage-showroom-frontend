"use client";

import { SearchX } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";

export default function SearchEmptyState({
  onReset,
}: {
  onReset: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="mt-8 rounded-3xl border border-dashed border-accent/30 bg-surface/60 px-6 py-14 text-center">
      <SearchX
        className="mx-auto size-9 text-accent"
        strokeWidth={1.2}
        aria-hidden="true"
      />

      <h2 className="mt-5 font-serif text-3xl text-primary">
        {t.search.emptyTitle}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-secondary">
        {t.search.emptyDescription}
      </p>

      <Button
        variant="outline"
        onClick={onReset}
        className="mt-6 rounded-full"
      >
        {t.search.reset}
      </Button>
    </div>
  );
}