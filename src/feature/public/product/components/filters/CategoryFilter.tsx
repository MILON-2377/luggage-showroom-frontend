"use client";
import { useLanguage } from "@/src/providers";
import FilterGroup from "./FilterGroup";
import type { FilterProps } from "../../types/product-query.types";
export default function CategoryFilter({ query, onChange }: FilterProps) {
  const { t } = useLanguage();
  const options = t.productPage.categories;
  return (
    <FilterGroup
      title={t.productPage.categoriesTitle}
      options={options}
      selected={query.categories}
      onToggle={(id) => {
        const selected = query.categories;
        onChange({
          categories: selected.includes(id as (typeof selected)[number])
            ? selected.filter((v) => v !== id)
            : [...selected, id as (typeof selected)[number]],
        });
      }}
    />
  );
}
