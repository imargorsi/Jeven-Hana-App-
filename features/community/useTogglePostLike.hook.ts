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
  });

  return {
    likePost: (id: string) => {
      // One in-flight like at a time — keeps rollback snapshots correct.
      if (likeMutation.isPending) return;
      likeMutation.mutate(id);
    },
    isPending: likeMutation.isPending,
    pendingPostId: likeMutation.isPending ? likeMutation.variables : null,
  };
}
