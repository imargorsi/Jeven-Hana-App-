import * as FileSystem from "expo-file-system/legacy";

import type { IApiEnvelope } from "@/features/auth/auth.types";
import { createApiClient, isApiConfigured } from "@/lib/api.client";

type TGetToken = () => Promise<string | null>;

export interface IPresignUploadResult {
  uploadUrl: string;
  objectKey: string;
  publicUrl: string;
  expiresInSeconds: number;
  contentType: string;
}

export interface IUploadStatus {
  configured: boolean;
  bucket: string | null;
  publicBaseUrl: string | null;
  provider: string;
}

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

function requireApi() {
  if (!isApiConfigured()) {
    throw new Error(
      "API is not configured. Set EXPO_PUBLIC_API_URL or run Expo in __DEV__.",
    );
  }
}

function extensionForContentType(contentType: string): string {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return "jpg";
}

/** Normalize picker MIME to what the API accepts. */
export function normalizeCoverContentType(
  mimeType?: string | null,
): string | null {
  if (!mimeType) return "image/jpeg";
  const normalized = mimeType.toLowerCase().trim();
  if (normalized === "image/jpg") return "image/jpeg";
  if (ALLOWED_TYPES.has(normalized)) {
    return normalized === "image/jpg" ? "image/jpeg" : normalized;
  }
  return null;
}

export async function getUploadStatus(
  getToken?: TGetToken,
): Promise<IUploadStatus> {
  requireApi();
  const client = createApiClient(getToken ?? (async () => null));
  const { data } = await client.get<IApiEnvelope<IUploadStatus>>(
    "/api/v1/uploads/status",
  );
  if (!data.success || !data.data) {
    throw new Error(data.message || "Failed to check upload status");
  }
  return data.data;
}

export async function createPresignedCoverUpload(
  params: {
    contentType: string;
    filename?: string;
  },
  getToken: TGetToken,
): Promise<IPresignUploadResult> {
  requireApi();
  const contentType = normalizeCoverContentType(params.contentType);
  if (!contentType) {
    throw new Error("Use a JPEG, PNG, or WebP image.");
  }

  const filename =
    params.filename?.trim() ||
    `cover.${extensionForContentType(contentType)}`;

  const client = createApiClient(getToken);
  const { data } = await client.post<IApiEnvelope<IPresignUploadResult>>(
    "/api/v1/uploads/presign",
    {
      folder: "businesses/covers",
      contentType,
      filename,
    },
  );

  if (!data.success || !data.data?.uploadUrl || !data.data.publicUrl) {
    throw new Error(data.message || "Could not start photo upload");
  }

  return data.data;
}

/**
 * PUT local image bytes to the R2 presigned URL.
 * Uses Expo FileSystem — `fetch(fileUri)` often fails on Android/iOS content URIs.
 */
export async function putLocalFileToPresignedUrl(
  uploadUrl: string,
  localUri: string,
  contentType: string,
): Promise<void> {
  const result = await FileSystem.uploadAsync(uploadUrl, localUri, {
    httpMethod: "PUT",
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    headers: {
      "Content-Type": contentType,
    },
  });

  if (result.status < 200 || result.status >= 300) {
    throw new Error(
      `Photo upload failed (${result.status}). Check R2 keys and that R2_PUBLIC_BASE_URL is your pub-….r2.dev URL.`,
    );
  }
}

/**
 * Full cover flow: presign → PUT to R2 → return public URL for `coverImageUrl`.
 */
export async function uploadBusinessCover(
  asset: {
    uri: string;
    mimeType?: string | null;
    fileName?: string | null;
  },
  getToken: TGetToken,
): Promise<string> {
  const contentType = normalizeCoverContentType(asset.mimeType);
  if (!contentType) {
    throw new Error("Use a JPEG, PNG, or WebP image.");
  }

  const filename =
    asset.fileName?.trim() ||
    `cover.${extensionForContentType(contentType)}`;

  const presign = await createPresignedCoverUpload(
    { contentType, filename },
    getToken,
  );

  await putLocalFileToPresignedUrl(
    presign.uploadUrl,
    asset.uri,
    presign.contentType,
  );

  return presign.publicUrl;
}
