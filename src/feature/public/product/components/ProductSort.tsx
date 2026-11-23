"use client";
import { useId } from "react";
import { Label } from "@/src/components/ui/label";
import { useLanguage } from "@/src/providers";
import type { ProductSortValue } from "../types/product-query.types";
export default function ProductSort({
  value,
  onChange,
}: {
  value: ProductSortValue;
  onChange: (sort: ProductSortValue) => void;
}) {
  const { t } = useLanguage();
  const c = t.productPage;
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={id} className="sr-only">
        {c.sortLabel}
      </Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as ProductSortValue)}
        className="h-11 max-w-full rounded-xl border border-border bg-surface px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <option value="featured">{c.sortFeatured}</option>
        <option value="name-asc">{c.sortAsc}</option>
        <option value="name-desc">{c.sortDesc}</option>
      </select>
    </div>
  );
}
