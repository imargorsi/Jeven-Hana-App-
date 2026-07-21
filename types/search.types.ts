import type { IBestOfListing } from "@/types/best-of.types";
import type { IBusiness } from "@/types/business.types";
import type { ICommunityPost } from "@/types/community.types";
import type { IEvent } from "@/types/event.types";
import type { IPlace } from "@/types/place.types";

export type TSearchTab =
  | "all"
  | "businesses"
  | "places"
  | "best-of"
  | "community"
  | "events";

export interface ISearchResults {
  businesses: IBusiness[];
  places: IPlace[];
  bestOf: IBestOfListing[];
  posts: ICommunityPost[];
  events: IEvent[];
}
