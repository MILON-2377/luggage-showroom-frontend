"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ProductQuery, QueryPatch } from "../types/product-query.types";
const initial: ProductQuery = {
  search: "",
  categories: [],
  materials: [],
  customization: [],
  sort: "featured",
  page: 1,
  pageSize: 6,
};
const keys = ["q", "category", "material", "custom", "sort", "page"];
export default function useProductQuery() {
  const [query, setQuery] = useState<ProductQuery>(initial);
  const [ready, setReady] = useState(false);
  const current = useRef(initial);
  useEffect(() => {
    function read() {
      const p = new URLSearchParams(location.search);
      const pick = <T extends string>(key: string, allowed: T[]) =>
        Array.from(
          new Set(
            (p.get(key) || "")
              .split(",")
              .filter((v): v is T => allowed.includes(v as T)),
          ),
        );
      const value: ProductQuery = {
        ...initial,
        search: (p.get("q") || "").slice(0, 200),
        categories: pick("category", ["eva","pencil","medical","toiletry","electronics","automotive","makeup","travel","tools","handbags","party","backpacks","documents","tote","shoulder","crossbody","clutch","bucket","mini","satchel","belt","shopping","duffel"]),
        materials: pick("material", ["eva", "pu", "pvc", "polyester"]),
        customization: pick("custom", ["logo", "color", "packaging"]),
        sort:
          p.get("sort") === "name-asc"
            ? "name-asc"
            : p.get("sort") === "name-desc"
              ? "name-desc"
              : "featured",
        page: Math.min(
          100000,
          Math.max(1, Math.floor(Number(p.get("page")) || 1)),
        ),
      };
      current.current = value;
      setQuery(value);
      setReady(true);
    }
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);
  const update = useCallback((patch: QueryPatch) => {
    const next = { ...current.current, ...patch, page: patch.page ?? 1 };
    current.current = next;
    setQuery(next);
    const url = new URL(location.href);
    keys.forEach((key) => url.searchParams.delete(key));
    if (next.search) url.searchParams.set("q", next.search);
    if (next.categories.length)
      url.searchParams.set("category", next.categories.join(","));
    if (next.materials.length)
      url.searchParams.set("material", next.materials.join(","));
    if (next.customization.length)
      url.searchParams.set("custom", next.customization.join(","));
    if (next.sort !== "featured") url.searchParams.set("sort", next.sort);
    if (next.page > 1) url.searchParams.set("page", String(next.page));
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }, []);
  const clear = useCallback(() => update({ ...initial }), [update]);
  return { query, update, clear, ready };
}
