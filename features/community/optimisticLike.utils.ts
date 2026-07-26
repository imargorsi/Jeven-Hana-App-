import type { QueryClient, QueryKey } from "@tanstack/react-query";

import type { IPaginatedResult } from "@/types/common.types";
import type { ICommunityPost } from "@/types/community.types";
import type { ISearchResults } from "@/types/search.types";

type TSnapshot = [QueryKey, unknown][];

function toggleLikeFields(post: ICommunityPost): ICommunityPost {
  const liked = Boolean(post.isLikedByMe);
  return {
    ...post,
    isLikedByMe: !liked,
    likeCount: Math.max(0, (post.likeCount ?? 0) + (liked ? -1 : 1)),
  };
}

function mergeServerPost(
  post: ICommunityPost,
  server: ICommunityPost,
): ICommunityPost {
  return {
    ...post,
    isLikedByMe: Boolean(server.isLikedByMe),
    likeCount: server.likeCount,
  };
}

function mapPostList(
  posts: ICommunityPost[],
  postId: string,
  mapFn: (post: ICommunityPost) => ICommunityPost,
): ICommunityPost[] {
  let changed = false;
  const next = posts.map((post) => {
    if (post.id !== postId) return post;
    changed = true;
    return mapFn(post);
  });
  return changed ? next : posts;
}

function patchUnknownCache(
  data: unknown,
  postId: string,
  mapFn: (post: ICommunityPost) => ICommunityPost,
): unknown {
  if (!data || typeof data !== "object") return data;

  // Feed: { items: ICommunityPost[] }
  if (
    "items" in data &&
    Array.isArray((data as IPaginatedResult<ICommunityPost>).items)
  ) {
    const page = data as IPaginatedResult<ICommunityPost>;
    const items = mapPostList(page.items, postId, mapFn);
    if (items === page.items) return data;
    return { ...page, items };
  }

  // Home / my posts: ICommunityPost[]
  if (Array.isArray(data)) {
    return mapPostList(data as ICommunityPost[], postId, mapFn);
  }

  // Search: { posts: ICommunityPost[], ... }
  if ("posts" in data && Array.isArray((data as ISearchResults).posts)) {
    const results = data as ISearchResults;
    const posts = mapPostList(results.posts, postId, mapFn);
    if (posts === results.posts) return data;
    return { ...results, posts };
  }

  return data;
}

const LIKE_CACHE_PREFIXES = [
  ["community-posts"],
  ["home-community-updates"],
  ["my-posts"],
  ["search"],
] as const;

function snapshotLikeCaches(queryClient: QueryClient): TSnapshot {
  const snapshots: TSnapshot = [];
  for (const prefix of LIKE_CACHE_PREFIXES) {
    for (const entry of queryClient.getQueriesData({ queryKey: [...prefix] })) {
      snapshots.push(entry);
    }
  }
  return snapshots;
}

function patchLikeCaches(
  queryClient: QueryClient,
  postId: string,
  mapFn: (post: ICommunityPost) => ICommunityPost,
) {
  for (const prefix of LIKE_CACHE_PREFIXES) {
    queryClient.setQueriesData({ queryKey: [...prefix] }, (old) =>
      patchUnknownCache(old, postId, mapFn),
    );
  }
}

/** Flip like + count in every open community cache immediately. */
export function applyOptimisticPostLike(
  queryClient: QueryClient,
  postId: string,
): TSnapshot {
  const previous = snapshotLikeCaches(queryClient);
  patchLikeCaches(queryClient, postId, toggleLikeFields);
  return previous;
}

/** Align caches with the API response after toggle succeeds. */
export function applyServerPostLike(
  queryClient: QueryClient,
  serverPost: ICommunityPost,
) {
  patchLikeCaches(queryClient, serverPost.id, (post) =>
    mergeServerPost(post, serverPost),
  );
}

/** Restore caches if the like request fails. */
export function rollbackOptimisticPostLike(
  queryClient: QueryClient,
  previous: TSnapshot,
) {
  for (const [key, data] of previous) {
    queryClient.setQueryData(key, data);
  }
}
