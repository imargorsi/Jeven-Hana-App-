import { delay } from "@/data/mocks/mock.utils";
import { getBestOfListings } from "@/lib/services/best-of.service";
import { getBusinesses } from "@/lib/services/businesses.service";
import { getCommunityPosts } from "@/lib/services/community.service";
import { getEvents } from "@/lib/services/events.service";
import { getPlaces } from "@/lib/services/places.service";
import type { ISearchResults } from "@/types/search.types";

const TRENDING = [
  "Chai Corner",
  "Friday Bazaar",
  "Masjid-e-Noor",
  "Hana Mart",
  "karahi",
];

export async function searchAll(query: string): Promise<ISearchResults> {
  await delay(250);
  const q = query.trim();
  if (!q) {
    return {
      businesses: [],
      places: [],
      bestOf: [],
      posts: [],
      events: [],
    };
  }

  const [businesses, places, bestOf, posts, events] = await Promise.all([
    getBusinesses({ query: q, limit: 10 }),
    getPlaces({ query: q, limit: 10 }),
    getBestOfListings({ limit: 20 }),
    getCommunityPosts({ limit: 20 }),
    getEvents({ limit: 20 }),
  ]);

  const lower = q.toLowerCase();
  return {
    businesses: businesses.items,
    places: places.items,
    bestOf: bestOf.items.filter(
      (b) =>
        b.title.toLowerCase().includes(lower) ||
        b.subtitle.toLowerCase().includes(lower),
    ),
    posts: posts.items.filter((p) => p.content.toLowerCase().includes(lower)),
    events: events.items.filter(
      (e) =>
        e.title.toLowerCase().includes(lower) ||
        e.description.toLowerCase().includes(lower),
    ),
  };
}

export async function getTrendingSearches(): Promise<string[]> {
  await delay(100);
  return TRENDING;
}

export async function getSearchSuggestions(query: string): Promise<string[]> {
  await delay(100);
  const q = query.trim().toLowerCase();
  if (!q) return TRENDING.slice(0, 5);
  return TRENDING.filter((t) => t.toLowerCase().includes(q));
}
