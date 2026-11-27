"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
} from "../../hooks/useCategories";
import type { CreateCategoryRequest } from "../../types/category.types";
import { CategoryForm } from "./CategoryForm";

export function CreateCategoryView() {
  const router = useRouter();
  const { data: categories = [] } = useCategoriesQuery({
    view: "flat",
    page: 1,
    page_size: 100,
  });
  const createMutation = useCreateCategoryMutation();

  const parentCategoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat.category_id,
  }));

  async function handleCreate(payload: CreateCategoryRequest) {
    try {
      await createMutation.mutateAsync(payload);
      router.push("/dashboard/catalog/categories");
    } catch {
      // Error is surfaced via createMutation.isError
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/catalog/categories")}
          aria-label="Back to categories"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Button>

        <div>
          <h1 className="text-lg font-semibold text-[var(--foreground)]">
            Create Category
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Configure hierarchy, required attributes, and media assets.
          </p>
        </div>
      </div>

      {createMutation.isError && (
        <div
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-500"
        >
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : "Failed to create category."}
        </div>
      )}

      <CategoryForm
        parentCategoryOptions={parentCategoryOptions}
        isSubmitting={createMutation.isPending}
        submitLabel="Create Category"
        onSubmit={handleCreate}
        onCancel={() => router.push("/dashboard/catalog/categories")}
      />
    </div>
  );
}