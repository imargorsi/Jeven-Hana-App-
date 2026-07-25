import type { IBusinessFormValues } from "@/features/businesses/businessForm.utils";
import { uploadBusinessCover } from "@/lib/services/uploads.service";

type TGetToken = () => Promise<string | null>;

/**
 * Resolves cover for create/update:
 * - new local pick → upload to R2 → public URL
 * - cleared → null (include in payload)
 * - unchanged → undefined (omit from payload so edit does not wipe)
 */
export async function resolveBusinessCoverForSubmit(
  values: IBusinessFormValues,
  getToken: TGetToken,
): Promise<
  | { includeCover: true; coverImageUrl: string | null }
  | { includeCover: false }
> {
  if (values.coverLocalUri) {
    const publicUrl = await uploadBusinessCover(
      {
        uri: values.coverLocalUri,
        mimeType: values.coverMimeType,
        fileName: values.coverFileName,
      },
      getToken,
    );
    return { includeCover: true, coverImageUrl: publicUrl };
  }

  if (values.coverCleared) {
    return { includeCover: true, coverImageUrl: null };
  }

  return { includeCover: false };
}
