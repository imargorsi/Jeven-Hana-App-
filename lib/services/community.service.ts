import type { IApiEnvelope } from "@/features/auth/auth.types";
import { createApiClient, isApiConfigured } from "@/lib/api.client";
import type { IPaginatedResult } from "@/types/common.types";
import type {
  ICommunityPost,
  ICommunityPostAuthor,
  TPostCategory,
} from "@/types/community.types";
import { POST_CATEGORIES } from "@/types/community.types";

type TGetToken = () => Promise<string | null>;

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

function requireApi() {
  if (!isApiConfigured()) {
    throw new Error(
      "API is not configured. Set EXPO_PUBLIC_API_URL or run Expo in __DEV__.",
    );
  }
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
    category: api.category as TPostCategory,
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

/**
 * GET /api/v1/community/posts — public feed (server-paginated).
 * Pass `limit` / `offset` so the API applies SQL LIMIT.
 */
export async function getCommunityPosts(params?: {
  category?: TPostCategory;
  getToken?: TGetToken;
  limit?: number;
  offset?: number;
}): Promise<IPaginatedResult<ICommunityPost>> {
  requireApi();
  const getToken = params?.getToken ?? (async () => null);
  const client = createApiClient(getToken);

  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set("category", params.category);
  if (params?.limit != null) searchParams.set("limit", String(params.limit));
  if (params?.offset != null) searchParams.set("offset", String(params.offset));
  const query = searchParams.toString();

  const { data } = await client.get<
    IApiEnvelope<{
      posts: IApiCommunityPost[];
      meta?: {
        limit: number;
        offset: number;
        hasMore: boolean;
        nextOffset: number | null;
      };
    }>
  >(`/api/v1/community/posts${query ? `?${query}` : ""}`);

  if (!data.success || !data.data?.posts) {
    throw new Error(data.message || "Failed to load posts");
  }

  const items = data.data.posts.map(mapPost);
  const meta = data.data.meta;

  return {
    items,
    nextCursor:
      meta?.nextOffset != null ? String(meta.nextOffset) : null,
    total: items.length,
  };
}

/** GET /api/v1/community/posts/me */
export async function getMyCommunityPosts(
  getToken: TGetToken,
): Promise<ICommunityPost[]> {
  requireApi();
  const client = createApiClient(getToken);
  const { data } = await client.get<
    IApiEnvelope<{ posts: IApiCommunityPost[] }>
  >("/api/v1/community/posts/me");

  if (!data.success || !data.data?.posts) {
    throw new Error(data.message || "Failed to load your posts");
  }

  return data.data.posts.map(mapPost);
}

/**
 * Home community strip — pinned-first page from the public feed.
 * Limit is applied on the server (SQL LIMIT), not after download.
 */
export async function getAdminCommunityHighlights(
  limit = 5,
  getToken?: TGetToken,
): Promise<ICommunityPost[]> {
  const result = await getCommunityPosts({ getToken, limit });
  return result.items;
}

export async function getCommunityPostById(
  id: string,
  getToken: TGetToken,
): Promise<ICommunityPost | null> {
  requireApi();
  const client = createApiClient(getToken);
  try {
    const { data } = await client.get<
      IApiEnvelope<{ post: IApiCommunityPost }>
    >(`/api/v1/community/posts/${id}`);
    if (!data.success || !data.data?.post) return null;
    return mapPost(data.data.post);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as { response?: { status?: number } }).response?.status === 404
    ) {
      return null;
    }
    throw error;
  }
}

export interface ICommunityPostWriteInput {
  content: string;
  category: TPostCategory;
  contentIsUrdu?: boolean;
  isPinned?: boolean;
  imageUrl?: string | null;
}

export async function createCommunityPost(
  input: ICommunityPostWriteInput,
  getToken: TGetToken,
): Promise<ICommunityPost> {
  requireApi();
  const client = createApiClient(getToken);
  const { data } = await client.post<
    IApiEnvelope<{ post: IApiCommunityPost }>
  >("/api/v1/community/posts", input);

  if (!data.success || !data.data?.post) {
    throw new Error(data.message || "Failed to create post");
  }

  return mapPost(data.data.post);
}

export async function updateCommunityPost(
  id: string,
  input: Partial<ICommunityPostWriteInput>,
  getToken: TGetToken,
): Promise<ICommunityPost> {
  requireApi();
  const client = createApiClient(getToken);
  const { data } = await client.patch<
    IApiEnvelope<{ post: IApiCommunityPost }>
  >(`/api/v1/community/posts/${id}`, input);

  if (!data.success || !data.data?.post) {
    throw new Error(data.message || "Failed to update post");
  }

  return mapPost(data.data.post);
}

export async function deleteCommunityPost(
  id: string,
  getToken: TGetToken,
): Promise<ICommunityPost> {
  requireApi();
  const client = createApiClient(getToken);
  const { data } = await client.delete<
    IApiEnvelope<{ post: IApiCommunityPost }>
  >(`/api/v1/community/posts/${id}`);

  if (!data.success || !data.data?.post) {
    throw new Error(data.message || "Failed to delete post");
  }

  return mapPost(data.data.post);
}

export async function toggleLikePost(
  id: string,
  getToken: TGetToken,
): Promise<ICommunityPost> {
  requireApi();
  const client = createApiClient(getToken);
  const { data } = await client.post<
    IApiEnvelope<{ post: IApiCommunityPost }>
  >(`/api/v1/community/posts/${id}/like`);

  if (!data.success || !data.data?.post) {
    throw new Error(data.message || "Failed to update like");
  }

  return mapPost(data.data.post);
}

export function isPostCategory(value: string): value is TPostCategory {
  return (POST_CATEGORIES as string[]).includes(value);
}
