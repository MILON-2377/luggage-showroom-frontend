"use client";
import { useLanguage } from "@/src/providers";
export default function ProductGridSkeleton() {
  const { t } = useLanguage();
  return (
    <div
      role="status"
      aria-label={t.productPage.loading}
      className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="rounded-[28px] border border-border bg-surface p-3 motion-safe:animate-pulse"
        >
          <div className="aspect-square rounded-[22px] bg-surface-muted" />
          <div className="m-4 h-5 w-2/3 rounded bg-surface-muted" />
          <div className="m-4 h-3 rounded bg-surface-muted" />
        </div>
      ))}
    </div>
  );
}
