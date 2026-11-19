"use client";

import { CircleAlert, RotateCcw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";

export default function SearchErrorState({
  onRetry,
}: {
  onRetry?: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div role="alert" className="mt-8 rounded-3xl border border-border bg-surface p-8 text-center">
      <CircleAlert
        className="mx-auto size-8 text-accent"
        aria-hidden="true"
      />

      <h2 className="mt-4 font-serif text-2xl text-primary">
        {t.search.errorTitle}
      </h2>

      <p className="mt-3 text-sm text-secondary">
        {t.search.errorDescription}
      </p>

      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="mt-6 rounded-full"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          {t.search.retry}
        </Button>
      )}
    </div>
  );
}