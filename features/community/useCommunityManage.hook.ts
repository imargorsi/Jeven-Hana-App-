import { useAuth } from "@clerk/expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { useMe } from "@/features/auth/useMe.hook";
import { useRequireAuth } from "@/features/auth/useRequireAuth.hook";
import { canManageCommunityPost } from "@/features/community/communityOwnership.utils";
import { getApiErrorMessage } from "@/lib/apiError.utils";
import { href } from "@/lib/navigation.utils";
import { deleteCommunityPost } from "@/lib/services/community.service";
import type { ICommunityPost } from "@/types/community.types";

export function invalidateCommunityQueries(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  void queryClient.invalidateQueries({ queryKey: ["community-posts"] });
  void queryClient.invalidateQueries({ queryKey: ["my-posts"] });
  void queryClient.invalidateQueries({ queryKey: ["home-community-updates"] });
  void queryClient.invalidateQueries({ queryKey: ["search"] });
}

/** Create / edit navigation + owner/admin delete for community cards. */
export function useCommunityManage() {
  const { getToken } = useAuth();
  const meQuery = useMe();
  const { requireAuth } = useRequireAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCommunityPost(id, getToken),
    onMutate: (id) => {
      setDeletingId(id);
    },
    onSuccess: () => {
      invalidateCommunityQueries(queryClient);
    },
    onError: (error) => {
      Alert.alert("Could not delete", getApiErrorMessage(error));
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const canManage = (post: ICommunityPost) =>
    canManageCommunityPost(meQuery.data, post);

  const openCreate = () => {
    requireAuth(() => {
      router.push(href("/community/create"));
    });
  };

  const openEdit = (postId: string) => {
    router.push(href(`/community/${postId}/edit`));
  };

  const confirmDelete = (post: ICommunityPost) => {
    const preview =
      post.content.length > 80
        ? `${post.content.slice(0, 80).trim()}…`
        : post.content;
    Alert.alert("Delete post?", `"${preview}" will be removed for everyone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMutation.mutate(post.id),
      },
    ]);
  };

  return {
    me: meQuery.data,
    canManage,
    openCreate,
    openEdit,
    confirmDelete,
    deletingId,
  };
}
