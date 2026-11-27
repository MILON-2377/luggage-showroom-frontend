import { adminFetch } from "@/src/lib/api/client";

import type {
  ConfirmMediaUploadRequest,
  ConfirmMediaUploadResponse,
  CreateMediaUploadIntentRequest,
  CreateMediaUploadIntentResponse,
} from "../types/media.types";

const CREATE_UPLOAD_INTENT_ENDPOINT = "media/uploads";

function getConfirmUploadEndpoint(mediaAssetId: string): string {
  return `media/${encodeURIComponent(mediaAssetId)}/confirm`;
}

export function createMediaUploadIntent(
  payload: CreateMediaUploadIntentRequest,
  signal?: AbortSignal,
): Promise<CreateMediaUploadIntentResponse> {
  return adminFetch<CreateMediaUploadIntentResponse>(
    CREATE_UPLOAD_INTENT_ENDPOINT,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal,
    },
  );
}

export function confirmMediaUpload(
  mediaAssetId: string,
  payload: ConfirmMediaUploadRequest,
  signal?: AbortSignal,
): Promise<ConfirmMediaUploadResponse> {
  return adminFetch<ConfirmMediaUploadResponse>(
    getConfirmUploadEndpoint(mediaAssetId),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal,
    },
  );
}