export type TBestOfCategorySlug =
  | "best-restaurant"
  | "best-cafe"
  | "best-chai"
  | "best-barber"
  | "best-pharmacy"
  | "best-grocery"
  | "best-mechanic"
  | "best-family-place";

export interface IBestOfCategory {
  slug: TBestOfCategorySlug;
  name: string;
  nameUrdu: string;
  description: string;
}

export interface IBestOfListing {
  id: string;
  categorySlug: TBestOfCategorySlug;
  title: string;
  titleUrdu?: string;
  subtitle: string;
  rank: number;
  rating: number;
  reviewSnippet: string;
  imageUrls: string[];
  /** Linked business or place id for detail navigation */
  linkedType: "business" | "place";
  linkedId: string;
}
