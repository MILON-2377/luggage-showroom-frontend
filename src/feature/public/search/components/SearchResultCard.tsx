"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Package } from "lucide-react";
import { useLanguage } from "@/src/providers";
import type { SearchProduct } from "../types/search.types";

export default function SearchResultCard({
  product,
  onNavigate,
}: {
  product: SearchProduct;
  onNavigate?: () => void;
}) {
  const { t } = useLanguage();
  const [failedImage, setFailedImage] = useState<string | null>(null);

  const showImage =
    Boolean(product.image) && failedImage !== product.image;

  return (
    <article className="group h-full [perspective:1100px]">
      <Link
        href={product.href}
        onClick={onNavigate}
        className="flex h-full flex-col overflow-hidden rounded-t-[100px] rounded-b-2xl border border-accent/15 bg-surface shadow-[0_16px_35px_-22px_rgba(23,23,23,0.35)] outline-none transition duration-500 focus-visible:ring-2 focus-visible:ring-accent motion-safe:hover:-translate-y-2 motion-safe:hover:[transform:translateY(-8px)_rotateX(3deg)]"
      >
        <div className="relative flex aspect-[5/4] items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,#ffffff_0%,#f1ede5_75%)] p-8">
          <div
            aria-hidden="true"
            className="absolute bottom-7 h-5 w-1/2 rounded-full bg-primary/15 blur-xl"
          />

          {showImage ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={() => setFailedImage(product.image ?? null)}
              className="relative h-full w-full object-contain drop-shadow-[0_18px_12px_rgba(0,0,0,0.2)] transition-transform duration-700 motion-safe:group-hover:-translate-y-3 motion-safe:group-hover:-rotate-6 motion-safe:group-hover:scale-105"
            />
          ) : (
            <div
              role="img"
              aria-label={t.search.imageUnavailable}
              className="relative flex size-20 items-center justify-center rounded-3xl border border-accent/20 bg-surface shadow-xl"
            >
              <Package
                className="size-10 text-accent"
                strokeWidth={1}
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-[9px] uppercase tracking-[0.2em] text-accent">
            {product.category}
          </p>

          <h3 className="mt-3 min-h-[2.5em] font-serif text-2xl leading-tight text-primary">
            {product.name}
          </h3>

          <p className="mt-3 line-clamp-2 text-xs leading-6 text-secondary">
            {product.description}
          </p>

          <div className="mt-auto pt-6">
            <span className="flex items-center justify-between border-t border-border pt-4 text-[10px] uppercase tracking-widest text-primary">
              {t.search.fullDetails}
              <ArrowUpRight
                className="size-4 text-accent"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}