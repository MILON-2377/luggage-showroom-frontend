"use client";

import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";
import type { FaqCategory } from "./faq.types";

export default function FaqCategoryTabs({
  categories,
  selected,
  onSelect,
}: {
  categories: FaqCategory[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  const { t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.faq.categoryLabel}
      className="flex flex-wrap gap-2"
    >
      {categories.map((category) => (
        <Button
          key={category.id}
          size="sm"
          variant={selected === category.id ? "default" : "outline"}
          aria-pressed={selected === category.id}
          onClick={() => onSelect(category.id)}
          className="rounded-full px-5"
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}