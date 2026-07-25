import type { IBusiness } from "@/types/business.types";
import type { ICommunityPost } from "@/types/community.types";
import type { IEvent } from "@/types/event.types";

export type TSearchTab = "all" | "businesses" | "community" | "events";

export interface ISearchResults {
  businesses: IBusiness[];
  posts: ICommunityPost[];
  events: IEvent[];
}
