"use client";
import { Check, PenTool } from "lucide-react";
import { useLanguage } from "@/src/providers";
import type { Product } from "../types/product.types";
export default function ProductCustomization({
  product,
}: {
  product: Product;
}) {
  const { t } = useLanguage();
  const c = t.productDetails;
  return (
    <div>
      <p className="text-sm leading-8 text-secondary">{c.customNote}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {product.customization.length ? (
          product.customization.map((id) => (
            <div
              key={id}
              className="rounded-2xl border border-accent/20 bg-background p-5"
            >
              <PenTool
                className="size-5 text-accent"
                strokeWidth={1.2}
                aria-hidden="true"
              />
              <h3 className="mt-4 font-serif text-xl">
                {t.productPage.customization.find((v) => v.id === id)?.label}
              </h3>
            </div>
          ))
        ) : (
          <p className="text-sm text-secondary">{c.pending}</p>
        )}
      </div>
      <ol className="mt-8 grid gap-4 sm:grid-cols-3">
        {c.steps.map((step, i) => (
          <li key={step} className="border-t border-border pt-4">
            <p
              aria-hidden="true"
              className="font-serif text-2xl italic text-accent"
            >
              0{i + 1}
            </p>
            <p className="mt-3 flex items-start gap-2 text-xs leading-7 text-secondary">
              <Check className="mt-1 size-3 shrink-0 text-accent" />
              {step}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
