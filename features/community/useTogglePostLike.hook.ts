import { useAuth } from "@clerk/expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

import { getApiErrorMessage } from "@/lib/apiError.utils";
import { toggleLikePost } from "@/lib/services/community.service";

/**
 * Like toggle without loading the community feed.
 * Use on Search (and similar) where only the mutation is needed.
 */
export function useTogglePostLike() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

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

  return {
    likePost: (id: string) => likeMutation.mutate(id),
    isPending: likeMutation.isPending,
  };
}
