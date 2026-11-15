"use client";
import { Layers3 } from "lucide-react";
import { useLanguage } from "@/src/providers";
import type { Product } from "../types/product.types";
export default function ProductMaterials({ product }: { product: Product }) {
  const { t } = useLanguage();
  const c = t.productDetails;
  return (
    <div>
      <p className="mb-6 text-sm leading-8 text-secondary">{c.materialNote}</p>
      {product.materials.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {product.materials.map((id) => (
            <article
              key={id}
              className="rounded-2xl border border-accent/20 bg-background p-6 shadow-[0_15px_30px_-25px_rgba(0,0,0,.3)]"
            >
              <Layers3
                className="size-6 text-accent"
                strokeWidth={1}
                aria-hidden="true"
              />
              <h3 className="mt-5 font-serif text-2xl">
                {t.productPage.materials.find((m) => m.id === id)?.label}
              </h3>
              <p className="mt-3 text-sm leading-7 text-secondary">
                {c.materialDescriptions[id]}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-accent/30 p-6 text-sm text-secondary">
          {c.pending}
        </p>
      )}
    </div>
  );
}
