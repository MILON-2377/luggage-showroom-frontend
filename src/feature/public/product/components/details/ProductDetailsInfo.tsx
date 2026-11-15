"use client";
import { Layers3, Ruler, PackageCheck } from "lucide-react";
import { useLanguage } from "@/src/providers";
import type { Product, ProductCopy } from "../types/product.types";
import ProductInquiryActions from "./ProductInquiryActions";
export default function ProductDetailsInfo({
  product,
  copy,
  color,
}: {
  product: Product;
  copy: ProductCopy;
  color: string;
}) {
  const { t } = useLanguage();
  const c = t.productDetails;
  return (
    <div className="lg:sticky lg:top-24">
      <p className="mb-6 flex items-center gap-2 text-[10px] uppercase tracking-[.22em] text-accent">
        <Layers3 className="size-3.5" aria-hidden="true" />
        {c.eyebrow}
      </p>
      <h1 className="font-serif text-4xl leading-[1.12] tracking-tight text-primary sm:text-5xl">
        {copy.name}
      </h1>
      <p className="mt-6 text-sm leading-8 text-secondary">
        {copy.description}
      </p>
      <p className="my-6 rounded-xl border border-accent/20 bg-accent/5 p-4 text-xs leading-6 text-secondary">
        {c.confirmation}
      </p>
      <div className="py-6">
        <p className="text-[10px] uppercase tracking-widest text-accent">
          {c.collectionTitle}
        </p>
        <p className="mt-3 text-sm leading-7 text-secondary">
          {c.collectionDescription}
        </p>
      </div>
      <ProductInquiryActions productId={product.id} color={color} />
      <div className="mt-7 grid grid-cols-2 gap-5 border-t border-border pt-6">
        {[
          { Icon: Ruler, title: c.sizing, description: c.sizingNote },
          {
            Icon: PackageCheck,
            title: c.packaging,
            description: c.packagingNote,
          },
        ].map(({ Icon, title, description }) => (
          <div key={title}>
            <Icon
              className="size-5 text-accent"
              strokeWidth={1.2}
              aria-hidden="true"
            />
            <h2 className="mt-3 text-[10px] uppercase tracking-widest">
              {title}
            </h2>
            <p className="mt-2 text-xs leading-6 text-secondary">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
