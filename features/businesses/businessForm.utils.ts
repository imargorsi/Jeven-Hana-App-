import type { IBusinessWriteInput } from "@/lib/services/businesses.service";
import {
  BUSINESS_CATEGORIES,
  BUSINESS_CATEGORY_LABELS,
  type IBusiness,
  type TBusinessCategorySlug,
} from "@/types/business.types";

export interface IBusinessFormValues {
  name: string;
  category: TBusinessCategorySlug;
  address: string;
  phone: string;
  whatsapp: string;
  description: string;
  /** Existing remote cover (from API). */
  coverImageUrl: string | null;
  /** Newly picked local URI — upload on submit. */
  coverLocalUri: string | null;
  coverMimeType: string | null;
  coverFileName: string | null;
  /** User removed cover on edit. */
  coverCleared: boolean;
}

export function emptyBusinessFormValues(): IBusinessFormValues {
  return {
    name: "",
    category: "food",
    address: "",
    phone: "",
    whatsapp: "",
    description: "",
    coverImageUrl: null,
    coverLocalUri: null,
    coverMimeType: null,
    coverFileName: null,
    coverCleared: false,
  };
}

export function businessToFormValues(business: IBusiness): IBusinessFormValues {
  return {
    name: business.name,
    category: business.category,
    address: business.address,
    phone: business.phone ?? "",
    whatsapp: business.whatsapp ?? "",
    description: business.description ?? "",
    coverImageUrl: business.coverImageUrl ?? null,
    coverLocalUri: null,
    coverMimeType: null,
    coverFileName: null,
    coverCleared: false,
  };
}

/** Preview URI for the form (local pick wins over remote). */
export function getCoverPreviewUri(values: IBusinessFormValues): string | null {
  if (values.coverLocalUri) return values.coverLocalUri;
  if (values.coverCleared) return null;
  return values.coverImageUrl;
}

export function buildBusinessPayload(
  values: IBusinessFormValues,
  options?: { coverImageUrl?: string | null; includeCover?: boolean },
): { payload: IBusinessWriteInput } | { error: string } {
  const name = values.name.trim();
  if (!name) {
    return { error: "Name is required." };
  }

  const address = values.address.trim();
  if (!address) {
    return { error: "Address is required." };
  }

  if (!BUSINESS_CATEGORIES.includes(values.category)) {
    return { error: "Pick a category." };
  }

  const payload: IBusinessWriteInput = {
    name,
    category: values.category,
    address,
    description: values.description.trim() || null,
    phone: values.phone.trim() || null,
    whatsapp: values.whatsapp.trim() || null,
  };

  if (options?.includeCover) {
    payload.coverImageUrl = options.coverImageUrl ?? null;
  }

  return { payload };
}

export { BUSINESS_CATEGORIES, BUSINESS_CATEGORY_LABELS };
