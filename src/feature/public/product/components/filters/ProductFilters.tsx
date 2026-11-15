"use client";
import { SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/src/providers";
import ProductSearch from "./ProductSearch";
import CategoryFilter from "./CategoryFilter";
import MaterialFilter from "./MaterialFilter";
import CustomizationFilter from "./CustomizationFilter";
import ClearFiltersButton from "./ClearFiltersButton";
import type { FilterProps } from "../../types/product-query.types";
export default function ProductFilters({
  query,
  onChange,
  onClear,
}: { onClear: () => void } & FilterProps) {
  const { t } = useLanguage();
  return (
    <div className="rounded-3xl border border-accent/20 bg-surface p-6 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.3)]">
      <div className="mb-6 flex items-center gap-3">
        <SlidersHorizontal className="size-4 text-accent" aria-hidden="true" />
        <h2 className="flex-1 font-serif text-xl">{t.productPage.filters}</h2>
      </div>
      <ProductSearch
        value={query.search}
        onChange={(search) => onChange({ search })}
      />
      <CategoryFilter query={query} onChange={onChange} />
      <MaterialFilter query={query} onChange={onChange} />
      <CustomizationFilter query={query} onChange={onChange} />
      <div className="pt-3">
        <ClearFiltersButton
          onClear={onClear}
          disabled={
            !query.search &&
            !query.categories.length &&
            !query.materials.length &&
            !query.customization.length
          }
        />
      </div>
    </div>
  );
}
