"use client";
import { useLanguage } from "@/src/providers";
import FilterGroup from "./FilterGroup";
import type { FilterProps } from "../../types/product-query.types";
export default function CustomizationFilter({ query, onChange }: FilterProps) {
  const { t } = useLanguage();
  const options = t.productPage.customization;
  return (
    <FilterGroup
      title={t.productPage.customizationTitle}
      options={options}
      selected={query.customization}
      onToggle={(id) => {
        const selected = query.customization;
        onChange({
          customization: selected.includes(id as (typeof selected)[number])
            ? selected.filter((v) => v !== id)
            : [...selected, id as (typeof selected)[number]],
        });
      }}
    />
  );
}
