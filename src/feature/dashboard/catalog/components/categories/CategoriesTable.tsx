"use client";

import { useRouter } from "next/navigation";
import { Pencil, Plus, RotateCcw } from "lucide-react";

import { Button } from "@/src/components/ui/button";

import type { CategoryItem } from "../../types/category.types";

type CategoriesTableProps = {
  categories: readonly CategoryItem[];
  parentNameMap?: ReadonlyMap<string, string>;
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
};

export function CategoriesTable({
  categories,
  parentNameMap,
  hasActiveFilters = false,
  onResetFilters,
  isLoading = false,
  errorMessage = null,
  onRetry,
}: CategoriesTableProps) {
  const router = useRouter();

  const fallbackNameById = new Map<string, string>(
    categories.map((cat) => [cat.category_id, cat.name]),
  );
  const resolveParentName = (parentId: string) =>
    parentNameMap?.get(parentId) ?? fallbackNameById.get(parentId) ?? parentId;

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-xs text-[var(--muted-foreground)]">
          Loading categories...
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4">
        <p role="alert" className="text-xs text-red-500">
          {errorMessage}
        </p>
        {onRetry && (
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-12 text-center">
        <p className="text-sm font-medium text-[var(--foreground)]">
          {hasActiveFilters
            ? "No matching categories found"
            : "No categories found"}
        </p>
        <p className="max-w-sm text-xs text-[var(--muted-foreground)]">
          {hasActiveFilters
            ? "Try adjusting or clearing your search and filter criteria."
            : "Create your first product category to attach attributes, media assets, and organize your catalog."}
        </p>
        {hasActiveFilters && onResetFilters ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetFilters}
          >
            <RotateCcw className="mr-1.5 size-3.5" aria-hidden="true" />
            Reset Filters
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            onClick={() => router.push("/dashboard/catalog/categories/new")}
          >
            <Plus className="mr-1.5 size-3.5" aria-hidden="true" />
            Create Category
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--surface-muted)]/60 text-[11px] font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Slug</th>
            <th className="px-4 py-3">Parent</th>
            <th className="px-4 py-3">Order</th>
            <th className="px-4 py-3">Children</th>
            <th className="px-4 py-3">Attributes</th>
            <th className="px-4 py-3">Media</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--border)]">
          {categories.map((category) => {
            const parentName = category.parent_id
              ? resolveParentName(category.parent_id)
              : "Root";
            const previewUrl = category.media?.find((item) => item.url)?.url;

            return (
              <tr
                key={category.category_id}
                className="transition-colors hover:bg-[var(--surface-muted)]/40"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt={category.name}
                        className="size-8 shrink-0 rounded-md border border-[var(--border)] object-cover"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="truncate font-medium text-[var(--foreground)]">
                        {category.name}
                      </div>
                      {category.description && (
                        <div className="line-clamp-1 max-w-xs text-xs text-[var(--muted-foreground)]">
                          {category.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 font-mono text-xs text-[var(--muted-foreground)]">
                  {category.slug ?? "—"}
                </td>

                <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                  {parentName}
                </td>

                <td className="px-4 py-3 font-mono text-xs text-[var(--foreground)]">
                  {category.display_order ?? 0}
                </td>

                <td className="px-4 py-3 font-mono text-xs text-[var(--foreground)]">
                  {category.children?.length ?? 0}
                </td>

                <td className="px-4 py-3 font-mono text-xs text-[var(--foreground)]">
                  {category.attributes?.length ?? 0}
                </td>

                <td className="px-4 py-3 font-mono text-xs text-[var(--foreground)]">
                  {category.media?.length ?? 0}
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex rounded-md bg-[var(--surface-muted)] px-2 py-0.5 font-mono text-[11px] font-medium text-[var(--foreground)]">
                    {category.status ?? "active"}
                  </span>
                </td>

                <td className="px-4 py-3 text-right">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(
                        `/dashboard/catalog/categories/${encodeURIComponent(category.category_id)}/edit`,
                      )
                    }
                  >
                    <Pencil className="mr-1.5 size-3.5" aria-hidden="true" />
                    Edit
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}