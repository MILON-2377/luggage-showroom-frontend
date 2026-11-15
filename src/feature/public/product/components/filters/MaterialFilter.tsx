"use client";
import { useLanguage } from "@/src/providers";
import FilterGroup from "./FilterGroup";
import type { FilterProps } from "../../types/product-query.types";
export default function MaterialFilter({ query, onChange }: FilterProps) {
  const { t } = useLanguage();
  const options = t.productPage.materials;
  return (
    <FilterGroup
      title={t.productPage.materialsTitle}
      options={options}
      selected={query.materials}
      onToggle={(id) => {
        const selected = query.materials;
        onChange({
          materials: selected.includes(id as (typeof selected)[number])
            ? selected.filter((v) => v !== id)
            : [...selected, id as (typeof selected)[number]],
        });
      }}
    />
  );
}
