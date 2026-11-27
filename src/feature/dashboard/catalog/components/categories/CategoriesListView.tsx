"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  useCategoriesPageQuery,
  useCategoriesQuery,
} from "../../hooks/useCategories";
import type { ListCategoriesParams } from "../../types/category.types";
import { CategoriesTable } from "./CategoriesTable";
import {
  CategoryFilters,
  type CategoryFilterValues,
} from "./CategoryFilters";

const DEFAULT_FILTERS: CategoryFilterValues = {
  search: "",
  status: "",
  parentId: "",
  view: "tree",
};

const DEFAULT_PAGE_SIZE = 20;

export function CategoriesListView() {
  const router = useRouter();
  const [filters, setFilters] = useState<CategoryFilterValues>(DEFAULT_FILTERS);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  const queryParams = useMemo<ListCategoriesParams>(() => {
    const trimmedSearch = filters.search.trim();

    return {
      search: trimmedSearch ? trimmedSearch.slice(0, 150) : undefined,
      status: filters.status || undefined,
      parent_id: filters.parentId || undefined,
      view: filters.view,
      page,
      page_size: pageSize,
    };
  }, [filters, page, pageSize]);

  const { data: parentCategories = [] } = useCategoriesQuery({
    view: "flat",
    page: 1,
    page_size: 100,
  });

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useCategoriesPageQuery(queryParams);

  const categories = data?.items ?? [];
  const pagination = data?.pagination;

  const errorMessage =
    error instanceof Error
      ? error.message
      : error
        ? "Failed to load categories."
        : null;

  function handleFiltersChange(next: CategoryFilterValues) {
    setFilters(next);
    setPage(1);
  }

  function handleResetFilters() {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }

  function handlePageSizeChange(nextSize: number) {
    setPageSize(nextSize);
    setPage(1);
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-[var(--foreground)]">
            Categories
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Manage product category hierarchy, assigned attributes, and media
            assets.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={() => router.push("/dashboard/catalog/categories/new")}
        >
          <Plus className="mr-1.5 size-3.5" aria-hidden="true" />
          New Category
        </Button>
      </div>

      <CategoryFilters
        filters={filters}
        parentOptions={parentCategories}
        disabled={isLoading}
        onChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      <CategoriesTable
        categories={categories}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onRetry={() => {
          void refetch();
        }}
      />

      {pagination && pagination.total_items > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-xs text-[var(--muted-foreground)]">
          <div className="flex items-center gap-3">
            <span>
              Page{" "}
              <strong className="font-medium text-[var(--foreground)]">
                {pagination.page}
              </strong>{" "}
              of{" "}
              <strong className="font-medium text-[var(--foreground)]">
                {Math.max(1, pagination.total_pages)}
              </strong>{" "}
              ({pagination.total_items} total)
            </span>

            <select
              value={pageSize}
              disabled={isFetching}
              aria-label="Items per page"
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="h-8 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 text-xs text-[var(--foreground)] focus:outline-none"
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size} / page
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!pagination.has_previous || isFetching}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              <ChevronLeft className="mr-1 size-3.5" aria-hidden="true" />
              Previous
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!pagination.has_next || isFetching}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
              <ChevronRight className="ml-1 size-3.5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}