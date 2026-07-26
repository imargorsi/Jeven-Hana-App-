import type { ICommunityPostFormValues } from "@/features/community/components/CommunityPostForm";
import { uploadCommunityPostImage } from "@/lib/services/uploads.service";

type TGetToken = () => Promise<string | null>;

/**
 * Resolves optional post image for create/update:
 * - new local pick → upload to R2 → public URL
 * - cleared → null (include in payload)
 * - unchanged → undefined (omit so edit does not wipe)
 */
export async function resolveCommunityPostImageForSubmit(
  values: ICommunityPostFormValues,
  getToken: TGetToken,
): Promise<
  | { includeImage: true; imageUrl: string | null }
  | { includeImage: false }
> {
  if (values.imageLocalUri) {
    const publicUrl = await uploadCommunityPostImage(
      {
        uri: values.imageLocalUri,
        mimeType: values.imageMimeType,
        fileName: values.imageFileName,
        fileSize: values.imageFileSize,
      },
      getToken,
    );
    return { includeImage: true, imageUrl: publicUrl };
  }

  if (values.imageCleared) {
    return { includeImage: true, imageUrl: null };
  }

  return { includeImage: false };
}
