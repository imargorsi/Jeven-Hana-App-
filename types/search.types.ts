import type { IBusiness } from "@/types/business.types";
import type { ICommunityPost } from "@/types/community.types";
import type { IEvent } from "@/types/event.types";
import type { IPlace } from "@/types/place.types";

export type TSearchTab =
  | "all"
  | "businesses"
  | "places"
  | "community"
  | "events";

export interface ISearchResults {
  businesses: IBusiness[];
  places: IPlace[];
  posts: ICommunityPost[];
  events: IEvent[];
}
