import { useAuth } from "@clerk/expo";
import { useQuery } from "@tanstack/react-query";

import { useTogglePostLike } from "@/features/community/useTogglePostLike.hook";
import { getCommunityPosts } from "@/lib/services/community.service";
import type { ICommunityPost, TPostCategory } from "@/types/community.types";

export function useCommunityPosts(category?: TPostCategory) {
  const { getToken } = useAuth();
  const queryKey = ["community-posts", category ?? "all"] as const;
  const { likePost, pendingPostId } = useTogglePostLike();

  const feedQuery = useQuery({
    queryKey,
    queryFn: () =>
      getCommunityPosts({
        category,
        getToken,
        limit: 40,
      }),
  });

  const posts: ICommunityPost[] = feedQuery.data?.items ?? [];

  return {
    posts,
    feedQuery,
    likePost,
    pendingPostId,
  };
}
