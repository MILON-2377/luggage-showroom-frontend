"use client";
import { useState } from "react";
import { customColorPalette } from "../../data/product-details";
import ProductColorSelector from "./ProductColorSelector";
import { useLanguage } from "@/src/providers";
import type { Product, ProductCopy } from "../../types/product.types";
import type { ProductDetailData } from "../../types/product-details.types"; 
import ProductBreadcrumbs from "./ProductBreadcrumbs";
import ProductDetailsGallery from "./ProductDetailsGallery";
import ProductDetailsInfo from "./ProductDetailsInfo";
import ProductDetailsTabs from "./ProductDetailsTabs";
import RelatedProducts from "./RelatedProducts";
export default function ProductDetailsSection({
  product,
  details,
  related,
}: {
  product: Product;
  details: ProductDetailData;
  related: Product[];
}) {
  const { t } = useLanguage();
  const catalog: Record<string, ProductCopy> = t.productPage.catalog;
  const copy = catalog[product.id];
  const colors = details.colors?.length ? details.colors : customColorPalette;
  const [selection, setSelection] = useState({ productId: product.id, color: "" });
  const color = selection.productId === product.id && colors.some(option => option.id === selection.color) ? selection.color : "";
  const variant = colors.find(option => option.id === color);
  const galleryImages = variant?.images?.length ? variant.images : product.images;
  if (!copy)
    return (
      <main className="bg-background px-6 py-24 text-center text-secondary">
        {t.productDetails.translationPending}
      </main>
    );
  return (
    <main className="min-h-screen bg-background pb-20 text-foreground">
      <ProductBreadcrumbs name={copy.name} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div className="min-w-0">
            <ProductDetailsGallery key={product.id + ":" + color} images={galleryImages} name={copy.name} />
            <div className="mt-5 rounded-2xl border border-accent/20 bg-surface px-5 pb-5 shadow-sm">
              <ProductColorSelector colors={colors} selected={color} onSelect={color => setSelection({productId:product.id,color})} />
              <p className="mt-4 text-xs leading-7 text-secondary">{t.productDetails.colorPreferenceNote}</p>
            </div>
          </div>
          <ProductDetailsInfo
            key={product.id}
            product={product}
            copy={copy}
            color={color}
          />
        </div>
        <ProductDetailsTabs
          product={product}
          details={details}
          name={copy.name}
        />
        <RelatedProducts products={related} />
      </div>
    </main>
  );
}
