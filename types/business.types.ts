import type { IOpeningHours, IReview, TAppImage } from "@/types/common.types";

/** Fixed v1 Explore categories — matches API enums. */
export type TBusinessCategorySlug = "food" | "masjid" | "shops" | "parks";

export const BUSINESS_CATEGORIES: TBusinessCategorySlug[] = [
  "food",
  "masjid",
  "shops",
  "parks",
];

export const BUSINESS_CATEGORY_LABELS: Record<TBusinessCategorySlug, string> = {
  food: "Food",
  masjid: "Masjid",
  shops: "Shops",
  parks: "Parks",
};

/** Slim v1 business / place listing (live API shape). */
export interface IBusiness {
  id: string;
  name: string;
  category: TBusinessCategorySlug;
  description: string | null;
  address: string;
  phone?: string | null;
  whatsapp?: string | null;
  coverImageUrl: string | null;
  /** Derived from coverImageUrl, or town fallback image when empty. */
  imageUrls: TAppImage[];
  /** From API `ratingAvg` — reviews write is part 2. */
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  createdByUserId: number;
  /** Always empty in part 1 — reviews API is part 2. */
  reviews: IReview[];
  /** Always empty in part 1 — hours out of scope. */
  hours: IOpeningHours[];
}
