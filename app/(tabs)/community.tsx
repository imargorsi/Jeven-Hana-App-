import { useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";

import { CommunityUpdateCard } from "@/components/CommunityUpdateCard";
import {
  CommunityFeedSkeleton,
  EmptyState,
  ErrorState,
  Screen,
} from "@/components/ui";
import { palette } from "@/constants/Colors";
import {
  CommunityFilterRow,
  type TCommunityFilterKey,
} from "@/features/community/components/CommunityFilterRow";
import { CreatePostActionCard } from "@/features/community/components/CreatePostActionCard";
import { useCommunityManage } from "@/features/community/useCommunityManage.hook";
import { useCommunityPosts } from "@/features/community/useCommunityPosts.hook";
import { getApiErrorMessage } from "@/lib/apiError.utils";

export default function CommunityTabScreen() {
  const [filter, setFilter] = useState<TCommunityFilterKey>("all");
  const { posts, feedQuery, likePost } = useCommunityPosts(
    filter === "all" ? undefined : filter,
  );
  const { canManage, openCreate, openEdit, confirmDelete, deletingId } =
    useCommunityManage();

  return (
    <Screen>
      <View className="mb-3 mt-2 px-4">
        <CreatePostActionCard onPress={openCreate} />
      </View>

      <View className="mb-4">
        <CommunityFilterRow selected={filter} onSelect={setFilter} />
      </View>

      {feedQuery.isLoading ? (
        <CommunityFeedSkeleton count={4} className="px-4" />
      ) : feedQuery.isError ? (
        <ErrorState
          description={getApiErrorMessage(feedQuery.error)}
          onRetry={() => void feedQuery.refetch()}
        />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-3.5 px-4"
          contentContainerStyle={{ paddingBottom: 48 }}
          initialNumToRender={6}
          maxToRenderPerBatch={8}
          windowSize={7}
          removeClippedSubviews
          refreshControl={
            <RefreshControl
              refreshing={feedQuery.isRefetching}
              onRefresh={() => void feedQuery.refetch()}
              tintColor={palette.primary}
            />
          }
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
          ListFooterComponent={<View style={{ height: 24 }} />}
          ListEmptyComponent={
            <EmptyState
              title="No Updates Yet"
              description="Create a post to share something with the neighbourhood."
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
}
