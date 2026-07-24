import type { ImagePickerAsset } from "expo-image-picker";

/**
 * Clerk Expo `setProfileImage` expects a base64 data URL on React Native
 * (Blob/File from fetch(file://) does not work reliably).
 */
export function toClerkProfileImageDataUrl(
  asset: ImagePickerAsset,
): string | null {
  if (!asset.base64) {
    return null;
  }

  const mimeType =
    asset.mimeType ||
    (asset.uri.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg");

  return `data:${mimeType};base64,${asset.base64}`;
}
