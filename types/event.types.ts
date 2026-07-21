import type { IGeoLocation } from "@/types/common.types";

export type TEventCategorySlug =
  | "community"
  | "religious"
  | "sports"
  | "family"
  | "education"
  | "health"
  | "local-market"
  | "social-welfare";

export interface IEventCategory {
  slug: TEventCategorySlug;
  name: string;
  nameUrdu: string;
}

export interface IEvent {
  id: string;
  title: string;
  titleUrdu?: string;
  description: string;
  categorySlug: TEventCategorySlug;
  imageUrls: string[];
  startsAt: string;
  endsAt: string;
  location: IGeoLocation;
  organizerName: string;
  organizerContact?: string;
  isFeatured?: boolean;
  interestedCount: number;
  isInterestedByMe?: boolean;
}
