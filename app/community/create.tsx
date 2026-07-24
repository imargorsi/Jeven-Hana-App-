import { useAuth } from "@clerk/expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { Screen } from "@/components/ui";
import { useMe } from "@/features/auth/useMe.hook";
import {
  buildCommunityPostPayload,
  CommunityPostForm,
  emptyCommunityPostFormValues,
  type ICommunityPostFormValues,
} from "@/features/community/components/CommunityPostForm";
import { invalidateCommunityQueries } from "@/features/community/useCommunityManage.hook";
import { getApiErrorMessage } from "@/lib/apiError.utils";
import { createCommunityPost } from "@/lib/services/community.service";

export default function CreateCommunityPostScreen() {
  const { getToken } = useAuth();
  const meQuery = useMe();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<ICommunityPostFormValues>(
    emptyCommunityPostFormValues,
  );
  const [isPinned, setIsPinned] = useState(false);
  const isAdmin = meQuery.data?.role === "admin";

  const mutation = useMutation({
    mutationFn: () => {
      const result = buildCommunityPostPayload(values);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return createCommunityPost(
        {
          ...result.payload,
          ...(isAdmin ? { isPinned } : {}),
        },
        getToken,
      );
    },
    onSuccess: () => {
      invalidateCommunityQueries(queryClient);
      router.back();
    },
    onError: (error) => {
      Alert.alert("Could not create", getApiErrorMessage(error));
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
    <Screen withSafeArea={false} withAppHeader={false}>
      <CommunityPostForm
        values={values}
        onChange={(patch) => setValues((prev) => ({ ...prev, ...patch }))}
        onSubmit={onSubmit}
        isSubmitting={mutation.isPending}
        submitLabel="Create Post"
        showPin={isAdmin}
        isPinned={isPinned}
        onPinnedChange={setIsPinned}
      />
    </Screen>
  );
}
