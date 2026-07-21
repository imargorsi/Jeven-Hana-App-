import type { IGeoLocation, IOpeningHours } from "@/types/common.types";

export type TPlaceCategorySlug =
  | "mosques"
  | "pharmacies"
  | "hospitals"
  | "parks"
  | "schools"
  | "banks"
  | "petrol"
  | "government"
  | "community-centres";

export interface IPlaceCategory {
  slug: TPlaceCategorySlug;
  name: string;
  nameUrdu: string;
  icon: string;
  count: number;
}

export interface IPlace {
  id: string;
  name: string;
  nameUrdu?: string;
  categorySlug: TPlaceCategorySlug;
  description: string;
  imageUrls: string[];
  phone?: string;
  location: IGeoLocation;
  hours?: IOpeningHours[];
  isNearby?: boolean;
  tags?: string[];
}
