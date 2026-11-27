export type MediaType = "image" | "video" | "document";

export type MediaUploadStatus = "pending" | "uploaded" | "confirmed" | "failed";

export type CreateMediaUploadIntentRequest = {
    original_filename: string;
    media_type: MediaType;
    mime_type: string;
    file_size: number;
};

export type CreateMediaUploadIntentResponse = {
    media_asset_id: string;
    upload_url: string;
    upload_params?: Record<string, string>;
};

export type ConfirmMediaUploadRequest = {
    media_asset_id: string;
    status?: MediaUploadStatus;
    media_type: MediaType;
    mime_type: string;
    file_format?: string;
    file_size: number;
    width?: number;
    height?: number;
    duration?: string;
    url?: string;
};

export type ConfirmMediaUploadResponse = {
    media_asset_id: string;
    status: MediaUploadStatus;
    media_type: MediaType;
    mime_type: string;
    file_format?: string | null;
    file_size: number;
    width?: number | null;
    height?: number | null;
    duration?: string | null;
    url: string;
};

export type UploadedMediaItem = {
    media_asset_id: string;
    url: string;
    media_type: MediaType;
    mime_type: string;
    file_size: number;
    original_filename: string;
    width?: number | null;
    height?: number | null;
};