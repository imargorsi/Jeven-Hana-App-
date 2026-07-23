import {
  communityPosts,
  setCommunityPosts,
} from "@/data/mocks/community.mock";
import { delay, paginate } from "@/data/mocks/mock.utils";
import type { IPaginatedResult } from "@/types/common.types";
import type { ICommunityPost, TPostCategory } from "@/types/community.types";

const CURRENT_USER_ID = "user-1";

function sortFeed(posts: ICommunityPost[]): ICommunityPost[] {
  return [...posts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export async function getCommunityPosts(params?: {
  category?: TPostCategory;
  cursor?: string | null;
  limit?: number;
  userId?: string;
}): Promise<IPaginatedResult<ICommunityPost>> {
  await delay();
  let list = sortFeed(communityPosts);
  if (params?.category) {
    list = list.filter((p) => p.category === params.category);
  }
  if (params?.userId) {
    list = list.filter((p) => p.user.id === params.userId);
  }
  list = list.map((p) => ({
    ...p,
    isLikedByMe: p.likedByIds?.includes(CURRENT_USER_ID) ?? false,
  }));
  return paginate(list, params?.cursor, params?.limit ?? 20);
}

/** Admin / pinned community posts for the Home feed list. */
export async function getAdminCommunityHighlights(
  limit = 5,
): Promise<ICommunityPost[]> {
  await delay();
  const preferred = sortFeed(communityPosts).filter(
    (p) => p.user.isAdmin && (p.isAnnouncement || p.isPinned),
  );
  const fallback = sortFeed(communityPosts).filter(
    (p) => !preferred.some((item) => item.id === p.id),
  );
  return [...preferred, ...fallback].slice(0, limit).map((p) => ({
    ...p,
    isLikedByMe: p.likedByIds?.includes(CURRENT_USER_ID) ?? false,
  }));
}

export async function toggleLikePost(id: string): Promise<ICommunityPost | null> {
  await delay(150);
  const idx = communityPosts.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  const post = communityPosts[idx];
  const liked = post.likedByIds ?? [];
  const isLiked = liked.includes(CURRENT_USER_ID);
  const likedByIds = isLiked
    ? liked.filter((uid) => uid !== CURRENT_USER_ID)
    : [...liked, CURRENT_USER_ID];
  const updated = {
    ...post,
    likedByIds,
    likeCount: Math.max(0, post.likeCount + (isLiked ? -1 : 1)),
    isLikedByMe: !isLiked,
  };
  const next = [...communityPosts];
  next[idx] = updated;
  setCommunityPosts(next);
  return updated;
}
