import { useAuth } from "@clerk/expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { ErrorState, LoadingBlock, Screen } from "@/components/ui";
import { useMe } from "@/features/auth/useMe.hook";
import { canManageCommunityPost } from "@/features/community/communityOwnership.utils";
import {
  buildCommunityPostPayload,
  CommunityPostForm,
  type ICommunityPostFormValues,
} from "@/features/community/components/CommunityPostForm";
import { invalidateCommunityQueries } from "@/features/community/useCommunityManage.hook";
import { getApiErrorMessage } from "@/lib/apiError.utils";
import {
  getCommunityPostById,
  updateCommunityPost,
} from "@/lib/services/community.service";
import type { ICommunityPost } from "@/types/community.types";

function EditPostForm({
  post,
  isAdmin,
}: {
  post: ICommunityPost;
  isAdmin: boolean;
}) {
  const { getToken } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<ICommunityPostFormValues>(() => ({
    content: post.content,
    category: post.category,
  }));
  const [isPinned, setIsPinned] = useState(Boolean(post.isPinned));

  const mutation = useMutation({
    mutationFn: () => {
      const result = buildCommunityPostPayload(values);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return updateCommunityPost(
        post.id,
        {
          ...result.payload,
          ...(isAdmin ? { isPinned } : {}),
        },
        getToken,
      );
    },
    onSuccess: () => {
      invalidateCommunityQueries(queryClient);
      void queryClient.invalidateQueries({
        queryKey: ["community-post", post.id],
      });
      router.back();
    },
    onError: (error) => {
      Alert.alert("Could not save", getApiErrorMessage(error));
    },
  });

  const onSubmit = () => {
    const result = buildCommunityPostPayload(values);
    if ("error" in result) {
      Alert.alert("Check details", result.error);
      return;
    }
    mutation.mutate();
  };

  return (
    <CommunityPostForm
      values={values}
      onChange={(patch) => setValues((prev) => ({ ...prev, ...patch }))}
      onSubmit={onSubmit}
      isSubmitting={mutation.isPending}
      submitLabel="Save changes"
      showPin={isAdmin}
      isPinned={isPinned}
      onPinnedChange={setIsPinned}
    />
  );
}

export default function EditCommunityPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = typeof id === "string" ? id : id?.[0];
  const { getToken } = useAuth();
  const meQuery = useMe();

  const postQuery = useQuery({
    queryKey: ["community-post", postId],
    queryFn: () => getCommunityPostById(postId!, getToken),
    enabled: Boolean(postId),
  });

  if (!postId) {
    return (
      <Screen withSafeArea={false} withAppHeader={false} className="px-4">
        <ErrorState description="Missing post id." />
      </Screen>
    );
  }

  if (postQuery.isLoading || meQuery.isLoading) {
    return (
      <Screen withSafeArea={false} withAppHeader={false}>
        <LoadingBlock />
      </Screen>
    );
  }

  if (postQuery.isError) {
    return (
      <Screen withSafeArea={false} withAppHeader={false} className="px-4">
        <ErrorState
          description={getApiErrorMessage(postQuery.error)}
          onRetry={() => void postQuery.refetch()}
        />
      </Screen>
    );
  }

  if (!postQuery.data) {
    return (
      <Screen withSafeArea={false} withAppHeader={false} className="px-4">
        <ErrorState description="Post not found." />
      </Screen>
    );
  }

  if (!canManageCommunityPost(meQuery.data, postQuery.data)) {
    return (
      <Screen withSafeArea={false} withAppHeader={false} className="px-4">
        <ErrorState description="You can only edit your own posts." />
      </Screen>
    );
  }

  return (
    <Screen withSafeArea={false} withAppHeader={false}>
      <EditPostForm
        key={postQuery.data.id}
        post={postQuery.data}
        isAdmin={meQuery.data?.role === "admin"}
      />
    </Screen>
  );
}
