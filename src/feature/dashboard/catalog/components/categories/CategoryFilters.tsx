"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { SearchInput } from "@/src/feature/common/components/SearchInput";
import type {
  CategoryItem,
  CategoryStatus,
  CategoryViewMode,
} from "../../types/category.types";

export type CategoryFilterValues = {
  search: string;
  status: CategoryStatus | "";
  parentId: string;
  view: CategoryViewMode;
};

type CategoryFiltersProps = {
  filters: CategoryFilterValues;
  parentOptions: CategoryItem[];
  disabled?: boolean;
  onChange: (next: CategoryFilterValues) => void;
  onReset: () => void;
};

const STATUS_OPTIONS: Array<{ label: string; value: CategoryStatus | "" }> = [
  { label: "All statuses", value: "" },
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
];

const VIEW_OPTIONS: Array<{ label: string; value: CategoryViewMode }> = [
  { label: "Tree view", value: "tree" },
  { label: "Flat list", value: "flat" },
];

export function CategoryFilters({
  filters,
  parentOptions,
  disabled = false,
  onChange,
  onReset,
}: CategoryFiltersProps) {
  const hasActiveFilters =
    filters.search.trim().length > 0 ||
    filters.status !== "" ||
    filters.parentId !== "" ||
    filters.view !== "tree";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        <SearchInput
          value={filters.search}
          maxLength={150}
          disabled={disabled}
          placeholder="Search categories by name or slug..."
          ariaLabel="Search categories"
          onChange={(search) => onChange({ ...filters, search })}
          className="min-w-[240px] flex-1 sm:max-w-xs"
        />

        <select
          value={filters.status}
          disabled={disabled}
          aria-label="Filter by status"
          onChange={(e) =>
            onChange({
              ...filters,
              status: e.target.value as CategoryStatus | "",
            })
          }
          className="h-9 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-xs text-[var(--foreground)] focus:outline-none"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={filters.parentId}
          disabled={disabled}
          aria-label="Filter by parent category"
          onChange={(e) => onChange({ ...filters, parentId: e.target.value })}
          className="h-9 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-xs text-[var(--foreground)] focus:outline-none"
        >
          <option value="">All parent categories</option>
          {parentOptions.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={filters.view}
          disabled={disabled}
          aria-label="Select hierarchy view"
          onChange={(e) =>
            onChange({
              ...filters,
              view: e.target.value as CategoryViewMode,
            })
          }
          className="h-9 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-xs text-[var(--foreground)] focus:outline-none"
        >
          {VIEW_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          onClick={onReset}
          className="gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Reset
        </Button>
      )}
    </div>
  );
}
