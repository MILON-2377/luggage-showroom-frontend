"use client";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/src/providers";
import ProductCard from "../ProductCard";
import { getProductSlug } from "../../data/product-details";
import type { Product, ProductCopy } from "../../types/product.types";
export default function RelatedProducts({ products }: { products: Product[] }) {
  const { t } = useLanguage();
  const router = useRouter();
  const catalog: Record<string, ProductCopy> = t.productPage.catalog;
  const visible = products.filter((p) => catalog[p.id]);
  if (!visible.length) return null;
  return (
    <section className="mt-20 border-t border-border pt-10">
      <p className="text-[10px] uppercase tracking-[.2em] text-accent">
        {t.productDetails.relatedEyebrow}
      </p>
      <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
        {t.productDetails.relatedTitle}
      </h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            copy={catalog[product.id]}
            onOpen={() => router.push("/product/" + getProductSlug(product))}
            onInquire={() =>
              router.push("/quote?product=" + encodeURIComponent(product.id))
            }
          />
        ))}
      </div>
    </section>
  );
}
