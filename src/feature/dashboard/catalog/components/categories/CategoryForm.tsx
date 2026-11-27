"use client";

import { useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  FormActions,
  FormCheckbox,
  FormField,
  FormSection,
  FormSelect,
  FormTextarea,
  MediaUploader,
  type FormFieldErrorMap,
  type SelectOption,
  type UploadedMediaItem,
} from "@/src/feature/common/components";

import type {
  CategoryAttributeAssignment,
  CategoryMediaAssignment,
  CategoryMediaRole,
  CategoryStatus,
  UpdateCategoryRequest,
} from "../../types/category.types";

export type AttributeChoiceOption = {
  id: string;
  label: string;
};

export type CategoryFormInitialData = {
  parent_id?: string | null;
  name?: string;
  description?: string | null;
  display_order?: number;
  status?: CategoryStatus;
  attributes?: CategoryAttributeAssignment[];
  media?: CategoryMediaAssignment[];
  mediaItems?: UploadedMediaItem[];
};

type AttributeRowState = CategoryAttributeAssignment & {
  rowKey: string;
};

type CategoryFormProps = {
  initialData?: CategoryFormInitialData;
  parentCategoryOptions?: readonly SelectOption[];
  availableAttributes?: readonly AttributeChoiceOption[];
  isSubmitting?: boolean;
  submitLabel?: string;
  onSubmit: (payload: UpdateCategoryRequest) => Promise<void> | void;
  onCancel?: () => void;
};

const CATEGORY_STATUS_OPTIONS: readonly SelectOption[] = [
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
];

const MEDIA_ROLE_OPTIONS: readonly SelectOption[] = [
  { label: "Image", value: "image" },
  { label: "Thumbnail", value: "thumbnail" },
  { label: "Banner", value: "banner" },
];

const DEFAULT_MEDIA_ROLE: CategoryMediaRole = "image";
const DEFAULT_STATUS: CategoryStatus = "draft";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_REGEX.test(value.trim());
}

function toNonNegativeInt(value: unknown, fallback = 0): number {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, Math.trunc(num));
}

function normalizeRole(role: unknown): CategoryMediaRole {
  if (role === "image" || role === "thumbnail" || role === "banner") {
    return role;
  }
  return DEFAULT_MEDIA_ROLE;
}

function normalizeStatus(status: unknown): CategoryStatus {
  if (status === "draft" || status === "active" || status === "archived") {
    return status;
  }
  return DEFAULT_STATUS;
}

export function CategoryForm({
  initialData,
  parentCategoryOptions = [],
  availableAttributes = [],
  isSubmitting = false,
  submitLabel = "Save Category",
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [parentId, setParentId] = useState(initialData?.parent_id ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [displayOrder, setDisplayOrder] = useState<number>(
    toNonNegativeInt(initialData?.display_order, 0),
  );
  const [status, setStatus] = useState<CategoryStatus>(
    normalizeStatus(initialData?.status),
  );
  const [attributes, setAttributes] = useState<AttributeRowState[]>(() =>
    (initialData?.attributes ?? []).map((attr, idx) => ({
      attribute_id: attr.attribute_id,
      is_required: Boolean(attr.is_required),
      display_order: toNonNegativeInt(attr.display_order, idx),
      rowKey: `attr-init-${idx}-${attr.attribute_id || "empty"}`,
    })),
  );
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMediaItem[]>(
    initialData?.mediaItems ?? [],
  );
  const [mediaRoles, setMediaRoles] = useState<
    Record<string, CategoryMediaRole>
  >(() => {
    const map: Record<string, CategoryMediaRole> = {};
    for (const item of initialData?.media ?? []) {
      map[item.media_asset_id] = normalizeRole(item.media_role);
    }
    return map;
  });
  const [errors, setErrors] = useState<FormFieldErrorMap<"name">>({});
  const [attributeError, setAttributeError] = useState<string | null>(null);

  const parentOptions: SelectOption[] = [
    { label: "None (Root Category)", value: "" },
    ...parentCategoryOptions,
  ];

  function addAttributeRow() {
    const firstAvailableId = availableAttributes[0]?.id ?? "";
    setAttributeError(null);
    setAttributes((prev) => [
      ...prev,
      {
        rowKey: crypto.randomUUID(),
        attribute_id: firstAvailableId,
        is_required: false,
        display_order: prev.length,
      },
    ]);
  }

  function updateAttributeRow(
    rowKey: string,
    patch: Partial<Omit<AttributeRowState, "rowKey">>,
  ) {
    setAttributeError(null);
    setAttributes((prev) =>
      prev.map((row) => {
        if (row.rowKey !== rowKey) return row;
        return {
          ...row,
          ...patch,
          display_order:
            patch.display_order !== undefined
              ? toNonNegativeInt(patch.display_order, row.display_order)
              : row.display_order,
        };
      }),
    );
  }

  function removeAttributeRow(rowKey: string) {
    setAttributeError(null);
    setAttributes((prev) =>
      prev
        .filter((row) => row.rowKey !== rowKey)
        .map((row, idx) => ({ ...row, display_order: idx })),
    );
  }

  function handleMediaChange(
    next: UploadedMediaItem | UploadedMediaItem[] | null,
  ) {
    const list = !next ? [] : Array.isArray(next) ? next : [next];
    setUploadedMedia(list);
    setMediaRoles((prev) => {
      const nextMap: Record<string, CategoryMediaRole> = {};
      for (const item of list) {
        nextMap[item.media_asset_id] = normalizeRole(prev[item.media_asset_id]);
      }
      return nextMap;
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const trimmedName = name.trim();
    const nextErrors: FormFieldErrorMap<"name"> = {};

    if (!trimmedName) {
      nextErrors.name = "Category name is required.";
    } else if (trimmedName.length > 150) {
      nextErrors.name = "Category name must be 150 characters or fewer.";
    }

    const hasInvalidAttribute = attributes.some(
      (attr) => !isUuid(attr.attribute_id),
    );
    if (hasInvalidAttribute) {
      setAttributeError(
        "Each assigned attribute must have a valid attribute UUID.",
      );
    } else {
      setAttributeError(null);
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || hasInvalidAttribute) return;

    const normalizedAttributes: CategoryAttributeAssignment[] = attributes.map(
      (attr, idx) => ({
        attribute_id: attr.attribute_id.trim(),
        is_required: Boolean(attr.is_required),
        display_order: toNonNegativeInt(attr.display_order, idx),
      }),
    );

    const normalizedMedia: CategoryMediaAssignment[] = uploadedMedia
      .filter((item) => isUuid(item.media_asset_id))
      .map((item, idx) => ({
        media_asset_id: item.media_asset_id.trim(),
        media_role: normalizeRole(mediaRoles[item.media_asset_id]),
        display_order: toNonNegativeInt(idx, 0),
      }));

    const trimmedParent = parentId.trim();
    const trimmedDescription = description.trim();

    const payload: UpdateCategoryRequest = {
      parent_id: trimmedParent && isUuid(trimmedParent) ? trimmedParent : null,
      name: trimmedName,
      description: trimmedDescription ? trimmedDescription : null,
      display_order: toNonNegativeInt(displayOrder, 0),
      status,
      attributes: normalizedAttributes,
      media: normalizedMedia,
    };

    await onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormSection
        title="Basic Details"
        description="Core hierarchy, naming, status, and display order for this category."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Category Name" required error={errors.name}>
            {(fieldProps) => (
              <Input
                {...fieldProps}
                maxLength={150}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Hardside Luggage"
              />
            )}
          </FormField>

          <FormField label="Parent Category" hint="Optional">
            {(fieldProps) => (
              <FormSelect
                {...fieldProps}
                value={parentId}
                onChange={setParentId}
                options={parentOptions}
              />
            )}
          </FormField>

          <FormField label="Status">
            {(fieldProps) => (
              <FormSelect
                {...fieldProps}
                value={status}
                onChange={(val) => setStatus(normalizeStatus(val))}
                options={CATEGORY_STATUS_OPTIONS}
              />
            )}
          </FormField>

          <FormField label="Display Order" hint="Lower numbers appear first">
            {(fieldProps) => (
              <Input
                {...fieldProps}
                type="number"
                min={0}
                value={displayOrder}
                onChange={(e) =>
                  setDisplayOrder(toNonNegativeInt(e.target.value, 0))
                }
              />
            )}
          </FormField>

          <div className="sm:col-span-2">
            <FormField label="Description" hint="Optional">
              {(fieldProps) => (
                <FormTextarea
                  {...fieldProps}
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this category for catalog administrators and storefront navigation..."
                />
              )}
            </FormField>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Assigned Attributes"
        badge={`${attributes.length}`}
        description="Define specification attributes and requirement flags for products in this category."
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAttributeRow}
          >
            <Plus className="mr-1.5 size-3.5" aria-hidden="true" />
            Add Attribute
          </Button>
        }
      >
        {attributeError && (
          <p role="alert" className="mb-3 text-xs text-red-500">
            {attributeError}
          </p>
        )}

        {attributes.length === 0 ? (
          <p className="text-xs text-[var(--muted-foreground)]">
            No attributes assigned yet. Click Add Attribute to attach one.
          </p>
        ) : (
          <div className="space-y-3">
            {attributes.map((attr, index) => (
              <div
                key={attr.rowKey}
                className="grid items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]/30 p-3 sm:grid-cols-[1fr_92px_auto_auto]"
              >
                {availableAttributes.length > 0 ? (
                  <FormSelect
                    value={attr.attribute_id}
                    onChange={(val) =>
                      updateAttributeRow(attr.rowKey, { attribute_id: val })
                    }
                    placeholder="Select attribute"
                    options={availableAttributes.map((a) => ({
                      label: a.label,
                      value: a.id,
                    }))}
                    aria-label={`Attribute ${index + 1}`}
                  />
                ) : (
                  <Input
                    value={attr.attribute_id}
                    onChange={(e) =>
                      updateAttributeRow(attr.rowKey, {
                        attribute_id: e.target.value,
                      })
                    }
                    placeholder="Attribute UUID"
                    aria-label={`Attribute ${index + 1} ID`}
                  />
                )}

                <Input
                  type="number"
                  min={0}
                  value={attr.display_order}
                  onChange={(e) =>
                    updateAttributeRow(attr.rowKey, {
                      display_order: toNonNegativeInt(e.target.value, 0),
                    })
                  }
                  aria-label={`Attribute ${index + 1} display order`}
                />

                <FormCheckbox
                  label="Required"
                  checked={attr.is_required}
                  onChange={(checked) =>
                    updateAttributeRow(attr.rowKey, { is_required: checked })
                  }
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAttributeRow(attr.rowKey)}
                  aria-label={`Remove attribute ${index + 1}`}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </FormSection>

      <FormSection
        title="Category Media"
        badge={`${uploadedMedia.length}`}
        description="Upload assets first, then assign each asset role before submitting the category."
      >
        <div className="space-y-4">
          <MediaUploader
            value={uploadedMedia}
            multiple
            mediaType="image"
            accept="image/*"
            label="Click or drag images to attach"
            hint="Assets are uploaded and confirmed immediately"
            disabled={isSubmitting}
            onChange={handleMediaChange}
          />

          {uploadedMedia.length > 0 && (
            <div className="space-y-2">
              {uploadedMedia.map((item, idx) => (
                <div
                  key={item.media_asset_id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]/30 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-[var(--foreground)]">
                      {idx + 1}. {item.original_filename}
                    </p>
                    <p className="truncate font-mono text-[10px] text-[var(--muted-foreground)]">
                      {item.media_asset_id}
                    </p>
                  </div>

                  <div className="w-40">
                    <FormSelect
                      value={normalizeRole(mediaRoles[item.media_asset_id])}
                      onChange={(role) =>
                        setMediaRoles((prev) => ({
                          ...prev,
                          [item.media_asset_id]: normalizeRole(role),
                        }))
                      }
                      options={MEDIA_ROLE_OPTIONS}
                      aria-label={`Role for ${item.original_filename}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </FormSection>

      <FormActions
        submitLabel={submitLabel}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  );
}