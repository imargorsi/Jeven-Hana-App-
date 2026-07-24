import { useAuth } from "@clerk/expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

import { getApiErrorMessage } from "@/lib/apiError.utils";
import {
  getCommunityPosts,
  toggleLikePost,
} from "@/lib/services/community.service";
import type { ICommunityPost, TPostCategory } from "@/types/community.types";

export function useCommunityPosts(category?: TPostCategory) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ["community-posts", category ?? "all"] as const;

  const feedQuery = useQuery({
    queryKey,
    queryFn: () =>
      getCommunityPosts({
        category,
        getToken,
      }),
  });

  const likeMutation = useMutation({
    mutationFn: (id: string) => toggleLikePost(id, getToken),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      void queryClient.invalidateQueries({ queryKey: ["search"] });
      void queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      void queryClient.invalidateQueries({
        queryKey: ["home-community-updates"],
      });
    },
    onError: (error) => {
      Alert.alert("Could not update", getApiErrorMessage(error));
    },
  });

  const posts: ICommunityPost[] = feedQuery.data?.items ?? [];

  return {
    posts,
    feedQuery,
    likePost: (id: string) => likeMutation.mutate(id),
  };
}
