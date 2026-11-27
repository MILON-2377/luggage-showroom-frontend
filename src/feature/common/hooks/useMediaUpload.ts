"use client";

import { useCallback, useState } from "react";

import { confirmMediaUpload, createMediaUploadIntent } from "../api/media.api";
import type {
  MediaType,
  UploadedMediaItem,
} from "../types/media.types";

type UseMediaUploadOptions = {
  mediaType?: MediaType;
  maxFileSizeBytes?: number;
  acceptedMimeTypes?: readonly string[];
  onUploaded?: (item: UploadedMediaItem) => void;
};

type UploadProgressStage = "idle" | "creating_intent" | "uploading" | "confirming" | "done" | "error";

function resolveMediaType(file: File, fallback: MediaType): MediaType {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return fallback;
}

function getFileFormat(file: File): string | undefined {
  const fromMime = file.type.split("/")[1];
  if (fromMime) return fromMime.toLowerCase();

  const parts = file.name.split(".");
  if (parts.length > 1) return parts.pop()?.toLowerCase();

  return undefined;
}

async function readImageDimensions(
  file: File,
): Promise<{ width?: number; height?: number }> {
  if (!file.type.startsWith("image/")) return {};

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const dimensions = {
        width: img.naturalWidth,
        height: img.naturalHeight,
      };
      URL.revokeObjectURL(objectUrl);
      resolve(dimensions);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({});
    };

    img.src = objectUrl;
  });
}

async function uploadBinaryToPresignedTarget(
  uploadUrl: string,
  uploadParams: Record<string, string> | undefined,
  file: File,
  signal?: AbortSignal,
): Promise<string | undefined> {
  if (uploadParams && Object.keys(uploadParams).length > 0) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(uploadParams)) {
      formData.append(key, value);
    }
    formData.append("file", file);

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
      signal,
    });

    if (!response.ok) {
      throw new Error(`Binary upload failed with status ${response.status}`);
    }

    try {
      const json = (await response.json()) as { secure_url?: string; url?: string };
      return json.secure_url ?? json.url;
    } catch {
      return undefined;
    }
  }

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
    signal,
  });

  if (!response.ok) {
    throw new Error(`Binary upload failed with status ${response.status}`);
  }

  return undefined;
}

export function useMediaUpload(options: UseMediaUploadOptions = {}) {
  const {
    mediaType: defaultMediaType = "image",
    maxFileSizeBytes,
    acceptedMimeTypes,
    onUploaded,
  } = options;

  const [stage, setStage] = useState<UploadProgressStage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [lastUploaded, setLastUploaded] = useState<UploadedMediaItem | null>(
    null,
  );

  const reset = useCallback(() => {
    setStage("idle");
    setError(null);
  }, []);

  const uploadFile = useCallback(
    async (
      file: File,
      signal?: AbortSignal,
    ): Promise<UploadedMediaItem | null> => {
      setError(null);

      if (
        typeof maxFileSizeBytes === "number" &&
        file.size > maxFileSizeBytes
      ) {
        const message = `File exceeds maximum allowed size (${maxFileSizeBytes} bytes).`;
        setError(message);
        setStage("error");
        return null;
      }

      if (
        acceptedMimeTypes &&
        acceptedMimeTypes.length > 0 &&
        !acceptedMimeTypes.includes(file.type)
      ) {
        const message = `Unsupported file type: ${file.type || file.name}.`;
        setError(message);
        setStage("error");
        return null;
      }

      const resolvedType = resolveMediaType(file, defaultMediaType);
      const mimeType = file.type || "application/octet-stream";

      try {
        setStage("creating_intent");
        const intent = await createMediaUploadIntent(
          {
            original_filename: file.name,
            media_type: resolvedType,
            mime_type: mimeType,
            file_size: file.size,
          },
          signal,
        );

        setStage("uploading");
        const [uploadedUrl, dimensions] = await Promise.all([
          uploadBinaryToPresignedTarget(
            intent.upload_url,
            intent.upload_params,
            file,
            signal,
          ),
          readImageDimensions(file),
        ]);

        setStage("confirming");
        const confirmed = await confirmMediaUpload(
          intent.media_asset_id,
          {
            media_asset_id: intent.media_asset_id,
            status: "uploaded",
            media_type: resolvedType,
            mime_type: mimeType,
            file_format: getFileFormat(file),
            file_size: file.size,
            width: dimensions.width,
            height: dimensions.height,
            url: uploadedUrl,
          },
          signal,
        );

        const item: UploadedMediaItem = {
          media_asset_id: confirmed.media_asset_id,
          url: confirmed.url || uploadedUrl || "",
          media_type: confirmed.media_type,
          mime_type: confirmed.mime_type,
          file_size: confirmed.file_size,
          original_filename: file.name,
          width: confirmed.width ?? dimensions.width,
          height: confirmed.height ?? dimensions.height,
        };

        setLastUploaded(item);
        setStage("done");
        onUploaded?.(item);
        return item;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to upload media file.";
        setError(message);
        setStage("error");
        return null;
      }
    },
    [acceptedMimeTypes, defaultMediaType, maxFileSizeBytes, onUploaded],
  );

  const isUploading =
    stage === "creating_intent" ||
    stage === "uploading" ||
    stage === "confirming";

  return {
    uploadFile,
    reset,
    stage,
    isUploading,
    error,
    lastUploaded,
  };
}