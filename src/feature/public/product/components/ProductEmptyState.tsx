"use client";
import { SearchX } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";
export default function ProductEmptyState({
  onAction,
}: {
  onAction: () => void;
}) {
  const { t } = useLanguage();
  const c = t.productPage;
  return (
    <div className="rounded-3xl border border-dashed border-accent/30 bg-surface/60 px-6 py-20 text-center">
      <SearchX
        className="mx-auto size-10 text-accent"
        strokeWidth={1}
        aria-hidden="true"
      />
      <h3 className="mt-6 font-serif text-3xl">{c.emptyTitle}</h3>
      <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-secondary">
        {c.emptyDescription}
      </p>
      <Button
        variant="outline"
        onClick={onAction}
        className="mt-7 rounded-full"
      >
        {c.clearFilters}
      </Button>
    </div>
  );
}
