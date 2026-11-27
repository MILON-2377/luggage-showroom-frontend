"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import type { UploadedMediaItem } from "@/src/feature/common/components";
import {
  useCategoriesQuery,
  useCategoryDetailQuery,
  useUpdateCategoryMutation,
} from "../../hooks/useCategories";
import type {
  CategoryAttributeAssignment,
  CategoryStatus,
  UpdateCategoryRequest,
} from "../../types/category.types";
import { CategoryForm, type CategoryFormInitialData } from "./CategoryForm";

type EditCategoryViewProps = {
  categoryId: string;
};

const VALID_CATEGORY_STATUSES: CategoryStatus[] = [
  "draft",
  "active",
  "archived",
];

function resolveCategoryStatus(status: unknown): CategoryStatus {
  return typeof status === "string" &&
    VALID_CATEGORY_STATUSES.includes(status as CategoryStatus)
    ? (status as CategoryStatus)
    : "draft";
}

export function EditCategoryView({ categoryId }: EditCategoryViewProps) {
  const router = useRouter();
  const { data: categories = [] } = useCategoriesQuery({
    view: "flat",
    page: 1,
    page_size: 100,
  });
  const {
    data: category,
    isLoading,
    error,
    refetch,
  } = useCategoryDetailQuery(categoryId);
  const updateMutation = useUpdateCategoryMutation(categoryId);

  const parentCategoryOptions = categories
    .filter((cat) => cat.category_id !== categoryId)
    .map((cat) => ({
      label: cat.name,
      value: cat.category_id,
    }));

  async function handleUpdate(payload: UpdateCategoryRequest) {
    try {
      await updateMutation.mutateAsync(payload);
      router.push("/dashboard/catalog/categories");
    } catch {
      // Error is surfaced via updateMutation.isError
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-xs text-[var(--muted-foreground)]">
            Loading category details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load category details.";

    return (
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4">
          <p role="alert" className="text-xs text-red-500">
            {message}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
            >
              Retry
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/catalog/categories")}
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const normalizedAttributes: CategoryAttributeAssignment[] = (
    category.attributes ?? []
  ).map((attr, idx) => ({
    attribute_id: attr.attribute_id,
    is_required: Boolean(attr.is_required),
    display_order: attr.display_order ?? idx,
  }));

  const initialMediaItems: UploadedMediaItem[] = (category.media ?? []).map(
    (item, idx) => {
      const filename =
        item.url.split("/").pop()?.split("?")[0] || `media-${idx + 1}`;
      const ext = filename.split(".").pop()?.toLowerCase() ?? "";
      const mimeByExt: Record<string, string> = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
        gif: "image/gif",
        svg: "image/svg+xml",
        avif: "image/avif",
      };

      return {
        media_asset_id: item.media_asset_id,
        original_filename: filename,
        url: item.url,
        media_type: "image",
        mime_type: mimeByExt[ext] ?? "image/*",
        file_size: 0,
      };
    },
  );

  const initialData: CategoryFormInitialData = {
    parent_id: category.parent_id ?? null,
    name: category.name,
    description: category.description ?? null,
    display_order: category.display_order ?? 0,
    status: resolveCategoryStatus(category.status),
    attributes: normalizedAttributes,
    media: category.media ?? [],
    mediaItems: initialMediaItems,
  };

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
            Edit Category
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Update details, attributes, and media for {category.name}.
          </p>
        </div>
      </div>

      {updateMutation.isError && (
        <div
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-500"
        >
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : "Failed to update category."}
        </div>
      )}

      <CategoryForm
        key={category.category_id}
        initialData={initialData}
        parentCategoryOptions={parentCategoryOptions}
        isSubmitting={updateMutation.isPending}
        submitLabel="Save Changes"
        onSubmit={handleUpdate}
        onCancel={() => router.push("/dashboard/catalog/categories")}
      />
    </div>
  );
}