import {
  communityPosts,
  mockUsers,
  postComments,
  setCommunityPosts,
  setPostComments,
} from "@/data/mocks/community.mock";
import { delay, paginate } from "@/data/mocks/mock.utils";
import type { IPaginatedResult } from "@/types/common.types";
import type {
  ICommunityPost,
  IPostComment,
  TPostCategory,
} from "@/types/community.types";

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

/** Admin community posts for Home auto-slider (image + text). */
export async function getAdminCommunityHighlights(
  limit = 3,
): Promise<ICommunityPost[]> {
  await delay();
  return sortFeed(communityPosts)
    .filter(
      (p) =>
        p.user.isAdmin &&
        p.imageUrls.length > 0 &&
        (p.isAnnouncement || p.isPinned),
    )
    .slice(0, limit)
    .map((p) => ({
      ...p,
      isLikedByMe: p.likedByIds?.includes(CURRENT_USER_ID) ?? false,
    }));
}

export async function getPostById(id: string): Promise<ICommunityPost | null> {
  await delay();
  const post = communityPosts.find((p) => p.id === id);
  if (!post) return null;
  return {
    ...post,
    isLikedByMe: post.likedByIds?.includes(CURRENT_USER_ID) ?? false,
  };
}

export async function createPost(input: {
  content: string;
  imageUrls: string[];
  category: TPostCategory;
}): Promise<ICommunityPost> {
  await delay(500);
  const user = mockUsers.find((u) => u.id === CURRENT_USER_ID) ?? mockUsers[1];
  const post: ICommunityPost = {
    id: `post-${Date.now()}`,
    content: input.content.trim(),
    imageUrls: input.imageUrls,
    category: input.category,
    createdAt: new Date().toISOString(),
    user,
    likeCount: 0,
    commentCount: 0,
    likedByIds: [],
  };
  setCommunityPosts([post, ...communityPosts]);
  return post;
}

export async function updatePost(
  id: string,
  input: { content: string; category: TPostCategory },
): Promise<ICommunityPost | null> {
  await delay();
  const idx = communityPosts.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  const updated = {
    ...communityPosts[idx],
    content: input.content.trim(),
    category: input.category,
    updatedAt: new Date().toISOString(),
  };
  const next = [...communityPosts];
  next[idx] = updated;
  setCommunityPosts(next);
  return updated;
}

export async function deletePost(id: string): Promise<boolean> {
  await delay();
  const next = communityPosts.filter((p) => p.id !== id);
  if (next.length === communityPosts.length) return false;
  setCommunityPosts(next);
  setPostComments(postComments.filter((c) => c.postId !== id));
  return true;
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

export async function reportPost(_id: string): Promise<void> {
  await delay(200);
}

export async function getComments(postId: string): Promise<IPostComment[]> {
  await delay();
  return postComments
    .filter((c) => c.postId === postId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
}

export async function createComment(
  postId: string,
  content: string,
): Promise<IPostComment> {
  await delay();
  const user = mockUsers.find((u) => u.id === CURRENT_USER_ID) ?? mockUsers[1];
  const comment: IPostComment = {
    id: `cmt-${Date.now()}`,
    postId,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    user,
    likeCount: 0,
  };
  setPostComments([...postComments, comment]);
  const idx = communityPosts.findIndex((p) => p.id === postId);
  if (idx >= 0) {
    const next = [...communityPosts];
    next[idx] = {
      ...next[idx],
      commentCount: next[idx].commentCount + 1,
    };
    setCommunityPosts(next);
  }
  return comment;
}

export async function deleteComment(id: string): Promise<boolean> {
  await delay();
  const comment = postComments.find((c) => c.id === id);
  if (!comment) return false;
  setPostComments(postComments.filter((c) => c.id !== id));
  const idx = communityPosts.findIndex((p) => p.id === comment.postId);
  if (idx >= 0) {
    const next = [...communityPosts];
    next[idx] = {
      ...next[idx],
      commentCount: Math.max(0, next[idx].commentCount - 1),
    };
    setCommunityPosts(next);
  }
  return true;
}
