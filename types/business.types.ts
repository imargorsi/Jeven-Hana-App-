import type { IGeoLocation, IOpeningHours, IReview, TAppImage } from "@/types/common.types";

export type TBusinessCategorySlug =
  | "restaurants"
  | "cafes"
  | "grocery"
  | "pharmacies"
  | "salons"
  | "electricians"
  | "plumbers"
  | "mechanics"
  | "tailors"
  | "tutors"
  | "gyms"
  | "home-services";

export interface IBusinessCategory {
  slug: TBusinessCategorySlug;
  name: string;
  nameUrdu: string;
  icon: string;
  count: number;
}

export interface IBusiness {
  id: string;
  name: string;
  nameUrdu?: string;
  categorySlug: TBusinessCategorySlug;
  description: string;
  imageUrls: TAppImage[];
  rating: number;
  reviewCount: number;
  phone?: string;
  whatsapp?: string;
  location: IGeoLocation;
  hours: IOpeningHours[];
  isFeatured?: boolean;
  isTopRated?: boolean;
  /** Curated Jevan Hana Ka Best listing */
  isKaBest?: boolean;
  reviews: IReview[];
  tags?: string[];
}
