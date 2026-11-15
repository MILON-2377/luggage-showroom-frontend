import { Suspense } from "react";
import { notFound } from "next/navigation";

import { draftProducts } from "@/src/feature/public/product/data/products";
import {
  getProductSlug,
  productDetails,
} from "@/src/feature/public/product/data/product-details";

import ProductDetailsSection from "@/src/feature/public/product/components/details/ProductDetailsSection";

interface ProductDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Prerender the known product URLs, including ID aliases.
export function generateStaticParams() {
  const slugs = new Set(
    draftProducts.flatMap((product) => [
      getProductSlug(product),
      product.id,
    ]),
  );

  return Array.from(slugs, (slug) => ({ slug }));
}

function ProductDetailsLoading() {
  return (
    <main
      aria-busy="true"
      className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
        <div className="aspect-[4/5] rounded-t-[130px] rounded-b-2xl bg-surface-muted motion-safe:animate-pulse" />

        <div className="space-y-6 py-8">
          <div className="h-5 w-1/3 rounded bg-surface-muted" />
          <div className="h-16 w-4/5 rounded bg-surface-muted" />
          <div className="h-24 rounded bg-surface-muted" />
          <div className="h-14 rounded-xl bg-surface-muted" />
        </div>
      </div>
    </main>
  );
}

async function ProductDetailsContent({
  params,
}: ProductDetailsPageProps) {
  const { slug } = await params;

  const product = draftProducts.find(
    (item) =>
      getProductSlug(item) === slug ||
      item.id === slug,
  );

  if (!product) {
    notFound();
  }

  const others = draftProducts.filter(
    (item) => item.id !== product.id,
  );

  const related = [
    ...others.filter(
      (item) => item.category === product.category,
    ),
    ...others.filter(
      (item) => item.category !== product.category,
    ),
  ].slice(0, 3);

  return (
    <ProductDetailsSection
      product={product}
      details={productDetails[product.id] || {}}
      related={related}
    />
  );
}

export default function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  return (
    <Suspense fallback={<ProductDetailsLoading />}>
      <ProductDetailsContent params={params} />
    </Suspense>
  );
}