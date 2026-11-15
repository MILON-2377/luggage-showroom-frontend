"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/src/providers";
import useProductQuery from "./hooks/useProductQuery";
import ProductHero from "./ProductHero";
import ProductToolbar from "./ProductToolbar";
import ProductGrid from "./ProductGrid";
import ProductQuickView from "./ProductQuickView";
import ProductPagination from "./ProductPagination";
import ProductGridSkeleton from "./ProductGridSkeleton";
import ProductEmptyState from "./ProductEmptyState";
import ProductErrorState from "./ProductErrorState";
import ProductInquiryCta from "./ProductInquiryCta";
import ProductFilters from "./filters/ProductFilters";
import ActiveFilterChips from "./filters/ActiveFilterChips";
import MobileFilterDrawer from "./filters/MobileFilterDrawer";
import { draftProducts } from "../data/products";
import type { Product, ProductCopy } from "./types/product.types";
export default function ProductSection({
  products = draftProducts,
  loading = false,
  error = false,
  onRetry,
}: {
  products?: Product[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}) {
  const { t, locale } = useLanguage();
  const c = t.productPage;
  const catalog: Record<string, ProductCopy> = c.catalog;
  const router = useRouter();
  const { query, update, clear, ready } = useProductQuery();
  const [selected, setSelected] = useState<Product | null>(null);
  const [drawer, setDrawer] = useState(false);
  const grid = useRef<HTMLDivElement>(null);
  const filtered = products.filter((product) => {
    const copy = catalog[product.id];
    if (!copy) return false;
    const text = [
      copy.name,
      copy.description,
      product.id,
      c.categories.find((v) => v.id === product.category)?.label,
      ...product.materials.map(
        (id) => c.materials.find((v) => v.id === id)?.label,
      ),
    ]
      .join(" ")
      .toLocaleLowerCase(locale);
    return (
      (!query.search.trim() ||
        text.includes(query.search.trim().toLocaleLowerCase(locale))) &&
      (!query.categories.length ||
        query.categories.includes(product.category)) &&
      (!query.materials.length ||
        query.materials.some((v) => product.materials.includes(v))) &&
      (!query.customization.length ||
        query.customization.every((v) => product.customization.includes(v)))
    );
  });
  if (query.sort !== "featured")
    filtered.sort(
      (a, b) =>
        catalog[a.id].name.localeCompare(catalog[b.id].name, locale) *
        (query.sort === "name-desc" ? -1 : 1),
    );
  const pages = Math.max(1, Math.ceil(filtered.length / query.pageSize));
  const page = Math.min(query.page, pages);
  const visible = filtered.slice(
    (page - 1) * query.pageSize,
    page * query.pageSize,
  );
  useEffect(() => {
    if (ready && query.page > pages) update({ page: pages });
  }, [ready, query.page, pages, update]);
  function inquire(product: Product) {
    router.push("/quote?product=" + encodeURIComponent(product.id));
  }
  return (
    <main className="w-full bg-background text-foreground">
      <ProductHero />
      <section
        id="product-collection"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-20 sm:px-6 lg:px-8"
      >
        <p className="mb-7 rounded-2xl border border-accent/20 bg-accent/5 px-5 py-3 text-xs leading-6 text-secondary">
          {c.draftNotice}
        </p>
        <div className="grid items-start gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <ProductFilters query={query} onChange={update} onClear={clear} />
          </aside>
          <div ref={grid} className="min-w-0 scroll-mt-28">
            <ProductToolbar
              total={filtered.length}
              sort={query.sort}
              onSort={(sort) => update({ sort })}
              onFilters={() => setDrawer(true)}
            />
            <div className="my-5">
              <ActiveFilterChips query={query} onChange={update} />
            </div>
            {loading || !ready ? (
              <ProductGridSkeleton />
            ) : error ? (
              <ProductErrorState
                onAction={onRetry || (() => window.location.reload())}
              />
            ) : !visible.length ? (
              <ProductEmptyState onAction={clear} />
            ) : (
              <ProductGrid
                products={visible}
                catalog={catalog}
                onOpen={setSelected}
                onInquire={inquire}
              />
            )}
            <ProductPagination
              page={page}
              totalPages={loading || error ? 1 : pages}
              onChange={(page) => {
                update({ page });
                grid.current?.scrollIntoView({
                  behavior: matchMedia("(prefers-reduced-motion:reduce)")
                    .matches
                    ? "instant"
                    : "smooth",
                  block: "start",
                });
              }}
            />
          </div>
        </div>
      </section>
      <ProductInquiryCta />
      <ProductQuickView
        product={selected}
        copy={selected ? catalog[selected.id] : undefined}
        onClose={() => setSelected(null)}
        onInquire={inquire}
      />
      <MobileFilterDrawer
        open={drawer}
        onClose={() => setDrawer(false)}
        query={query}
        onChange={update}
        onClear={clear}
      />
    </main>
  );
}
