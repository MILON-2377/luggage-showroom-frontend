"use client";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";
import ProductSort from "./ProductSort";
import type { ProductSortValue } from "./types/product-query.types";
export default function ProductToolbar({
  total,
  sort,
  onSort,
  onFilters,
}: {
  total: number;
  sort: ProductSortValue;
  onSort: (sort: ProductSortValue) => void;
  onFilters: () => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
      <p role="status" className="text-xs text-secondary">
        {t.productPage.results}:{" "}
        <span className="text-primary tabular-nums">{total}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onFilters}
          aria-label={t.productPage.filters}
          className="h-11 w-11 rounded-xl lg:hidden"
        >
          <SlidersHorizontal className="size-4" />
        </Button>
        <ProductSort value={sort} onChange={onSort} />
      </div>
    </div>
  );
}
