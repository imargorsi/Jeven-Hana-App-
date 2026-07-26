import type { IApiEnvelope } from "@/features/auth/auth.types";
import { createApiClient, isApiConfigured } from "@/lib/api.client";
import { IMG } from "@/lib/image.utils";
import type {
  IBusiness,
  TBusinessCategorySlug,
} from "@/types/business.types";
import type {
  ICommunityPost,
  ICommunityPostAuthor,
} from "@/types/community.types";
import type { IEvent } from "@/types/event.types";
import type { ISearchResults, TSearchTab } from "@/types/search.types";

type TGetToken = () => Promise<string | null>;

interface IApiBusiness {
  id: number;
  name: string;
  category: string;
  description: string | null;
  address: string;
  phone: string | null;
  whatsapp: string | null;
  coverImageUrl: string | null;
  isFeatured: boolean;
  ratingAvg: number;
  reviewCount: number;
  createdByUserId: number;
}

interface IApiAuthor {
  id: number;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  role: string;
}

interface IApiCommunityPost {
  id: number;
  content: string;
  contentIsUrdu: boolean;
  category: string;
  isPinned: boolean;
  likeCount: number;
  imageUrl?: string | null;
  isLikedByMe?: boolean;
  createdByUserId: number;
  author: IApiAuthor | null;
  createdAt: string;
  updatedAt: string;
}

interface IApiEvent {
  id: number;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string | null;
  location: string;
  interestedCount: number;
  isGoingByMe?: boolean;
  createdByUserId?: number;
}

interface IApiSearchData {
  query: string;
  type: string;
  businesses: IApiBusiness[];
  posts: IApiCommunityPost[];
  events: IApiEvent[];
}

function requireApi() {
  if (!isApiConfigured()) {
    throw new Error(
      "API is not configured. Set EXPO_PUBLIC_API_URL or run Expo in __DEV__.",
    );
  }
}

function mapBusiness(api: IApiBusiness): IBusiness {
  const cover = api.coverImageUrl?.trim() || null;
  return {
    id: String(api.id),
    name: api.name,
    category: api.category as TBusinessCategorySlug,
    description: api.description,
    address: api.address,
    phone: api.phone,
    whatsapp: api.whatsapp,
    coverImageUrl: cover,
    imageUrls: cover ? [cover] : [IMG.businessFallback],
    rating: Number(api.ratingAvg) || 0,
    reviewCount: api.reviewCount || 0,
    isFeatured: Boolean(api.isFeatured),
    createdByUserId: api.createdByUserId,
    reviews: [],
    hours: [],
  };
}

function mapAuthor(author: IApiAuthor | null): ICommunityPostAuthor {
  if (!author) {
    return {
      id: "0",
      firstName: null,
      lastName: null,
      fullName: "Neighbour",
      isAdmin: false,
    };
  }
  const fullName =
    [author.firstName, author.lastName].filter(Boolean).join(" ").trim() ||
    "Neighbour";
  return {
    id: String(author.id),
    firstName: author.firstName,
    lastName: author.lastName,
    fullName,
    avatarUrl: author.imageUrl?.trim() || undefined,
    isAdmin: author.role === "admin",
  };
}

function mapPost(api: IApiCommunityPost): ICommunityPost {
  return {
    id: String(api.id),
    content: api.content,
    contentIsUrdu: Boolean(api.contentIsUrdu),
    category: api.category as ICommunityPost["category"],
    createdAt:
      typeof api.createdAt === "string"
        ? api.createdAt
        : new Date(api.createdAt).toISOString(),
    updatedAt: api.updatedAt
      ? typeof api.updatedAt === "string"
        ? api.updatedAt
        : new Date(api.updatedAt).toISOString()
      : undefined,
    user: mapAuthor(api.author),
    likeCount: api.likeCount,
    imageUrl: api.imageUrl?.trim() || null,
    isLikedByMe: Boolean(api.isLikedByMe),
    isPinned: Boolean(api.isPinned),
    createdByUserId: api.createdByUserId,
  };
}

function mapEvent(api: IApiEvent): IEvent {
  return {
    id: String(api.id),
    title: api.title,
    description: api.description,
    startsAt:
      typeof api.startsAt === "string"
        ? api.startsAt
        : new Date(api.startsAt).toISOString(),
    endsAt: api.endsAt
      ? typeof api.endsAt === "string"
        ? api.endsAt
        : new Date(api.endsAt).toISOString()
      : null,
    location: api.location,
    interestedCount: api.interestedCount,
    isGoingByMe: Boolean(api.isGoingByMe),
    createdByUserId: api.createdByUserId,
  };
}

/** GET /api/v1/search?q=&type= */
export async function searchAll(
  query: string,
  getToken: TGetToken,
  type: TSearchTab = "all",
): Promise<ISearchResults> {
  requireApi();
  const q = query.trim();
  if (!q) {
    return { businesses: [], posts: [], events: [] };
  }

  const client = createApiClient(getToken);
  const { data } = await client.get<IApiEnvelope<IApiSearchData>>(
    "/api/v1/search",
    { params: { q, type } },
  );

  if (!data.success || !data.data) {
    throw new Error(data.message || "Search failed");
  }

  return {
    businesses: (data.data.businesses ?? []).map(mapBusiness),
    posts: (data.data.posts ?? []).map(mapPost),
    events: (data.data.events ?? []).map(mapEvent),
  };
}

/**
 * GET /api/v1/search/trending
 * Top 5 featured business names for idle chips.
 */
export async function getTrendingSearches(
  getToken?: TGetToken,
): Promise<string[]> {
  requireApi();
  const client = createApiClient(getToken ?? (async () => null));
  const { data } = await client.get<
    IApiEnvelope<{ businesses: IApiBusiness[] }>
  >("/api/v1/search/trending");

  if (!data.success || !data.data?.businesses) {
    throw new Error(data.message || "Failed to load trending");
  }

  return data.data.businesses.map((b) => b.name);
}

/** Client-side filter of trending names while typing (before debounce fires). */
export function getSearchSuggestions(
  query: string,
  trending: string[] = [],
): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return trending.slice(0, 5);
  return trending.filter((t) => t.toLowerCase().includes(q)).slice(0, 5);
}
