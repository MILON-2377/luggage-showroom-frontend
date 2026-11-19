"use client";

import Link from "next/link";
import { ArrowUpRight, Layers3 } from "lucide-react";
import { buttonVariants } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";
import type { SearchCategory } from "../types/search.types";

export default function SearchCategoryList({
  items,
  onNavigate,
}: {
  items: SearchCategory[];
  onNavigate?: () => void;
}) {
  const { t } = useLanguage();
  if (!items.length) return null;

  return (
    <section className="mt-8 border-t border-border pt-6">
      <h2 className="mb-4 text-xs uppercase tracking-widest text-accent">
        {t.search.categories}
      </h2>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={onNavigate}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "rounded-full",
            })}
          >
            <Layers3 className="size-3.5" aria-hidden="true" />
            {item.label}
            <ArrowUpRight className="size-3" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}