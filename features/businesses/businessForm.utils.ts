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
}

export function emptyBusinessFormValues(): IBusinessFormValues {
  return {
    name: "",
    category: "food",
    address: "",
    phone: "",
    whatsapp: "",
    description: "",
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
  };
}

export function buildBusinessPayload(
  values: IBusinessFormValues,
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

  return {
    payload: {
      name,
      category: values.category,
      address,
      description: values.description.trim() || null,
      phone: values.phone.trim() || null,
      whatsapp: values.whatsapp.trim() || null,
      // Cover upload via R2 later — omit so edit does not clear existing URLs.
    },
  };
}

export { BUSINESS_CATEGORIES, BUSINESS_CATEGORY_LABELS };
