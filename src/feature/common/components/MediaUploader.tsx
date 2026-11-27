"use client";

import { useRef, type ChangeEvent, type DragEvent } from "react";
import { Loader2, Trash2, UploadCloud, X } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { useMediaUpload } from "../hooks/useMediaUpload";
import type { MediaType, UploadedMediaItem } from "../types/media.types";

type MediaUploaderProps = {
  value?: UploadedMediaItem | UploadedMediaItem[] | null;
  multiple?: boolean;
  mediaType?: MediaType;
  accept?: string;
  acceptedMimeTypes?: readonly string[];
  maxFileSizeBytes?: number;
  label?: string;
  hint?: string;
  disabled?: boolean;
  onChange: (value: UploadedMediaItem | UploadedMediaItem[] | null) => void;
};

function toArray(
  val: UploadedMediaItem | UploadedMediaItem[] | null | undefined,
): UploadedMediaItem[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

export function MediaUploader({
  value,
  multiple = false,
  mediaType = "image",
  accept = "image/*",
  acceptedMimeTypes,
  maxFileSizeBytes,
  label = "Upload Media",
  hint,
  disabled = false,
  onChange,
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const items = toArray(value);

  const { uploadFile, isUploading, stage, error, reset } = useMediaUpload({
    mediaType,
    acceptedMimeTypes,
    maxFileSizeBytes,
    onUploaded: (uploaded) => {
      if (multiple) {
        onChange([...items, uploaded]);
      } else {
        onChange(uploaded);
      }
    },
  });

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0 || disabled) return;

    if (!multiple) {
      await uploadFile(files[0]);
      return;
    }

    const nextList: UploadedMediaItem[] = [...items];
    for (const file of Array.from(files)) {
      const uploaded = await uploadFile(file);
      if (uploaded) {
        nextList.push(uploaded);
        onChange([...nextList]);
      }
    }
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    void handleFiles(e.target.files);
    e.target.value = "";
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (disabled || isUploading) return;
    void handleFiles(e.dataTransfer.files);
  }

  function handleRemove(mediaAssetId: string) {
    if (!multiple) {
      onChange(null);
      reset();
      return;
    }

    const filtered = items.filter(
      (item) => item.media_asset_id !== mediaAssetId,
    );
    onChange(filtered);
  }

  const stageLabelMap: Record<typeof stage, string> = {
    idle: "",
    creating_intent: "Preparing upload...",
    uploading: "Uploading file...",
    confirming: "Confirming asset...",
    done: "Upload complete",
    error: "Upload failed",
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)]/40 px-4 py-6 text-center transition-colors ${
          disabled || isUploading
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--surface-muted)]/70"
        }`}
        onClick={() => {
          if (!disabled && !isUploading) {
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled || isUploading}
          onChange={handleInputChange}
          className="hidden"
        />

        {isUploading ? (
          <Loader2
            className="mb-2 size-6 animate-spin text-[var(--accent)]"
            aria-hidden="true"
          />
        ) : (
          <UploadCloud
            className="mb-2 size-6 text-[var(--accent)]"
            aria-hidden="true"
          />
        )}

        <p className="text-xs font-medium text-[var(--foreground)]">
          {isUploading ? stageLabelMap[stage] : label}
        </p>

        {hint && (
          <p className="mt-1 text-[11px] text-[var(--muted-foreground)]">
            {hint}
          </p>
        )}
      </div>

      {error && (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-500">
          <span role="alert">{error}</span>
          <button
            type="button"
            onClick={reset}
            className="shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium hover:bg-red-500/20"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      {items.length > 0 && (
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.media_asset_id}
              className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2.5"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                {item.media_type === "image" && item.url ? (
                  <img
                    src={item.url}
                    alt={item.original_filename}
                    className="size-11 shrink-0 rounded-md border border-[var(--border)] object-cover"
                  />
                ) : (
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-muted)] font-mono text-[10px] text-[var(--muted-foreground)] uppercase">
                    {item.media_type}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-[var(--foreground)]">
                    {item.original_filename}
                  </p>
                  <p className="truncate font-mono text-[10px] text-[var(--muted-foreground)]">
                    {item.media_asset_id}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled || isUploading}
                onClick={() => handleRemove(item.media_asset_id)}
                aria-label={`Remove ${item.original_filename}`}
              >
                <Trash2
                  className="size-4 text-[var(--muted-foreground)]"
                  aria-hidden="true"
                />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
