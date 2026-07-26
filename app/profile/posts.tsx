import { useAuth } from "@clerk/expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, FlatList, View } from "react-native";

import { CommunityUpdateCard } from "@/components/CommunityUpdateCard";
import {
  CommunityFeedSkeleton,
  EmptyState,
  ErrorState,
  Screen,
} from "@/components/ui";
import { useCommunityManage } from "@/features/community/useCommunityManage.hook";
import { getApiErrorMessage } from "@/lib/apiError.utils";
import {
  getMyCommunityPosts,
  toggleLikePost,
} from "@/lib/services/community.service";

export default function MyPostsScreen() {
  const { getToken, userId } = useAuth();
  const queryClient = useQueryClient();
  const { canManage, openEdit, confirmDelete, deletingId } =
    useCommunityManage();

  const query = useQuery({
    queryKey: ["my-posts", userId],
    queryFn: () => getMyCommunityPosts(getToken),
    enabled: Boolean(userId),
  });

  const likeMutation = useMutation({
    mutationFn: (id: string) => toggleLikePost(id, getToken),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["my-posts", userId] });
      void queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      void queryClient.invalidateQueries({ queryKey: ["search"] });
      void queryClient.invalidateQueries({
        queryKey: ["home-community-updates"],
      });
    },
    onError: (error) => {
      Alert.alert("Could not update", getApiErrorMessage(error));
    },
  });

  if (query.isLoading) {
    return (
      <Screen withSafeArea={false} withAppHeader={false}>
        <CommunityFeedSkeleton count={4} className="px-4 pt-4" />
      </Screen>
    );
  }

  if (query.isError) {
    return (
      <Screen withSafeArea={false} withAppHeader={false} className="px-4">
        <ErrorState
          description={getApiErrorMessage(query.error)}
          onRetry={() => void query.refetch()}
        />
      </Screen>
    );
  }

  return (
    <Screen withSafeArea={false} withAppHeader={false}>
      <FlatList
        data={query.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-3.5 px-4 pb-10 pt-2"
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={7}
        removeClippedSubviews
        renderItem={({ item }) => (
          <CommunityUpdateCard
            post={item}
            onLike={(id) => likeMutation.mutate(id)}
            canManage={canManage(item)}
            onEdit={() => openEdit(item.id)}
            onDelete={() => confirmDelete(item)}
            isDeleting={deletingId === item.id}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No Posts Yet"
            description="Your community updates will show up here."
          />
        }
        ItemSeparatorComponent={() => <View className="h-0" />}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}
