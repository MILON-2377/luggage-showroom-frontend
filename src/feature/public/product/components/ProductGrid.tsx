"use client";
import ProductCard from "./ProductCard";
import type { Product, ProductCopy } from "./types/product.types";
export default function ProductGrid({
  products,
  catalog,
  onOpen,
  onInquire,
}: {
  products: Product[];
  catalog: Record<string, ProductCopy>;
  onOpen: (product: Product) => void;
  onInquire: (product: Product) => void;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          copy={catalog[product.id]}
          onOpen={() => onOpen(product)}
          onInquire={() => onInquire(product)}
        />
      ))}
    </div>
  );
}
