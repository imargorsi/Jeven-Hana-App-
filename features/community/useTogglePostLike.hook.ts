import { useAuth } from "@clerk/expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

import {
  applyOptimisticPostLike,
  applyServerPostLike,
  rollbackOptimisticPostLike,
} from "@/features/community/optimisticLike.utils";
import { getApiErrorMessage } from "@/lib/apiError.utils";
import { toggleLikePost } from "@/lib/services/community.service";
import type { ICommunityPost } from "@/types/community.types";

type TLikeContext = {
  previous: ReturnType<typeof applyOptimisticPostLike>;
};

/**
 * Cross-instance guard — Home / Community / Search / My Posts each mount
 * their own hook, but they share the same React Query caches.
 */
let globalLikeInFlight = false;

/**
 * Instant like/unlike in the UI; syncs with the API in the background.
 * Shared by Community, Home, Search, and My Posts.
 */
export function useTogglePostLike() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: (id: string) => toggleLikePost(id, getToken),
    onMutate: async (id): Promise<TLikeContext> => {
      await queryClient.cancelQueries({ queryKey: ["community-posts"] });
      await queryClient.cancelQueries({ queryKey: ["home-community-updates"] });
      await queryClient.cancelQueries({ queryKey: ["my-posts"] });
      await queryClient.cancelQueries({ queryKey: ["search"] });

      const previous = applyOptimisticPostLike(queryClient, id);
      return { previous };
    },
    onSuccess: (serverPost: ICommunityPost) => {
      applyServerPostLike(queryClient, serverPost);
    },
    onError: (error, _id, context) => {
      if (context?.previous) {
        rollbackOptimisticPostLike(queryClient, context.previous);
      }
      Alert.alert("Could Not Update", getApiErrorMessage(error));
    },
    onSettled: () => {
      globalLikeInFlight = false;
    },
  });

  return {
    likePost: (id: string) => {
      // One in-flight like app-wide — keeps rollback snapshots correct.
      if (globalLikeInFlight || likeMutation.isPending) return;
      globalLikeInFlight = true;
      likeMutation.mutate(id);
    },
    isPending: likeMutation.isPending,
    pendingPostId: likeMutation.isPending ? likeMutation.variables : null,
  };
}
