import { useAuth } from "@clerk/expo";
import { useQuery } from "@tanstack/react-query";
import { FlatList, View } from "react-native";

import { CommunityUpdateCard } from "@/components/CommunityUpdateCard";
import {
  CommunityFeedSkeleton,
  EmptyState,
  ErrorState,
  Screen,
} from "@/components/ui";
import { useCommunityManage } from "@/features/community/useCommunityManage.hook";
import { useTogglePostLike } from "@/features/community/useTogglePostLike.hook";
import { getApiErrorMessage } from "@/lib/apiError.utils";
import { getMyCommunityPosts } from "@/lib/services/community.service";

export default function MyPostsScreen() {
  const { getToken, userId } = useAuth();
  const { canManage, openEdit, confirmDelete, deletingId } =
    useCommunityManage();
  const { likePost } = useTogglePostLike();

  const query = useQuery({
    queryKey: ["my-posts", userId],
    queryFn: () => getMyCommunityPosts(getToken),
    enabled: Boolean(userId),
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
            onLike={likePost}
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
