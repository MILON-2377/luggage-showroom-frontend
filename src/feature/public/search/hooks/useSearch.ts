"use client";

import { useMemo } from "react";
import { useLanguage } from "@/src/providers";
import { draftProducts } from "@/src/feature/public/product/data/products";
import { getProductSlug } from "@/src/feature/public/product/data/product-details";
import type { ProductCopy } from "@/src/feature/public/product/types/product.types";
import type {
  SearchCategory,
  SearchProduct,
  SearchResultsData,
} from "../types/search.types";
import { matchesSearch } from "../utils/search.utils";

export function useSearch(query: string): SearchResultsData {
  const { t } = useLanguage();

  return useMemo(() => {
    const catalog: Record<string, ProductCopy> =
      t.productPage.catalog;

    const categories: SearchCategory[] =
      t.productPage.categories.map((category) => ({
        id: category.id,
        label: category.label,
        href: `/category/${encodeURIComponent(category.id)}`,
      }));

    const products: SearchProduct[] = draftProducts.flatMap(
      (product) => {
        const copy = catalog[product.id];

        if (!copy) return [];

        const category =
          categories.find((item) => item.id === product.category)
            ?.label ?? product.category;

        const materials = product.materials.map(
          (material) =>
            t.productPage.materials.find(
              (item) => item.id === material,
            )?.label ?? material,
        );

        return [{
          id: product.id,
          categoryId: product.category,
          category,
          name: copy.name,
          description: copy.description,
          image: product.images[0],
          href: `/product/${encodeURIComponent(
            getProductSlug(product),
          )}`,
          keywords: [
            copy.name,
            copy.description,
            category,
            ...materials,
          ].join(" "),
        }];
      },
    );

    return {
      products: products.filter((product) =>
        matchesSearch(product.keywords, query),
      ),
      categories: categories.filter((category) =>
        matchesSearch(category.label, query),
      ),
    };
  }, [query, t]);
}