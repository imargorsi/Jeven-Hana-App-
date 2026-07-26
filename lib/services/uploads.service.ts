import * as FileSystem from "expo-file-system/legacy";

import type { IApiEnvelope } from "@/features/auth/auth.types";
import { createApiClient, isApiConfigured } from "@/lib/api.client";

type TGetToken = () => Promise<string | null>;

/** Max business cover upload size (5 MB). Keep in sync with API `MAX_COVER_BYTES`. */
export const MAX_COVER_BYTES = 5 * 1024 * 1024;

export interface IPresignUploadResult {
  uploadUrl: string;
  objectKey: string;
  publicUrl: string;
  expiresInSeconds: number;
  contentType: string;
  maxBytes?: number;
  byteSize?: number;
}

export interface IUploadStatus {
  configured: boolean;
  bucket: string | null;
  publicBaseUrl: string | null;
  provider: string;
  maxBytes?: number;
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

export function isCoverWithinSizeLimit(byteSize: number | null | undefined): boolean {
  if (byteSize == null || !Number.isFinite(byteSize)) return false;
  return byteSize > 0 && byteSize <= MAX_COVER_BYTES;
}

/**
 * Resolve local file byte size (picker `fileSize` or FileSystem).
 */
export async function getLocalFileByteSize(
  uri: string,
  knownSize?: number | null,
): Promise<number | null> {
  if (
    knownSize != null &&
    Number.isFinite(knownSize) &&
    knownSize > 0
  ) {
    return Math.trunc(knownSize);
  }

  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists && "size" in info && typeof info.size === "number") {
      return info.size;
    }
  } catch {
    // Fall through — caller should reject unknown size.
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
    byteSize: number;
  },
  getToken: TGetToken,
): Promise<IPresignUploadResult> {
  requireApi();
  const contentType = normalizeCoverContentType(params.contentType);
  if (!contentType) {
    throw new Error("Use a JPEG, PNG, or WebP image.");
  }
  if (!isCoverWithinSizeLimit(params.byteSize)) {
    throw new Error("Cover photo must be 5 MB or smaller.");
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
      byteSize: params.byteSize,
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
 * Full cover flow: size check → presign → PUT to R2 → public URL.
 */
export async function uploadBusinessCover(
  asset: {
    uri: string;
    mimeType?: string | null;
    fileName?: string | null;
    fileSize?: number | null;
  },
  getToken: TGetToken,
): Promise<string> {
  const contentType = normalizeCoverContentType(asset.mimeType);
  if (!contentType) {
    throw new Error("Use a JPEG, PNG, or WebP image.");
  }

  const byteSize = await getLocalFileByteSize(asset.uri, asset.fileSize);
  if (!isCoverWithinSizeLimit(byteSize)) {
    throw new Error("Cover photo must be 5 MB or smaller.");
  }

  const filename =
    asset.fileName?.trim() ||
    `cover.${extensionForContentType(contentType)}`;

  const presign = await createPresignedCoverUpload(
    { contentType, filename, byteSize: byteSize as number },
    getToken,
  );

  await putLocalFileToPresignedUrl(
    presign.uploadUrl,
    asset.uri,
    presign.contentType,
  );

  return presign.publicUrl;
}
