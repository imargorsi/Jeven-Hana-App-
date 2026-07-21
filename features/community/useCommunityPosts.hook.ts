import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getCommunityPosts,
  toggleLikePost,
} from "@/lib/services/community.service";
import type { ICommunityPost, TPostCategory } from "@/types/community.types";

export function useCommunityPosts(category?: TPostCategory) {
  const queryClient = useQueryClient();
  const queryKey = ["community-posts", category ?? "all"] as const;

  const feedQuery = useInfiniteQuery({
    queryKey,
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      getCommunityPosts({
        category,
        cursor: pageParam,
        limit: 10,
      }),
    getNextPageParam: (last) => last.nextCursor,
  });

  const likeMutation = useMutation({
    mutationFn: toggleLikePost,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["community-posts"] });
    },
  });

  const posts: ICommunityPost[] =
    feedQuery.data?.pages.flatMap((p) => p.items) ?? [];

  return {
    posts,
    feedQuery,
    likePost: (id: string) => likeMutation.mutate(id),
  };
}
