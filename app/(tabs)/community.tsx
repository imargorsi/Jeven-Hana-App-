import { useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";

import { CommunityUpdateCard } from "@/components/CommunityUpdateCard";
import {
  EmptyState,
  ErrorState,
  LoadingBlock,
  Screen,
} from "@/components/ui";
import { palette } from "@/constants/Colors";
import {
  CommunityFilterRow,
  type TCommunityFilterKey,
} from "@/features/community/components/CommunityFilterRow";
import { useCommunityPosts } from "@/features/community/useCommunityPosts.hook";

export default function CommunityTabScreen() {
  const [filter, setFilter] = useState<TCommunityFilterKey>("all");
  const { posts, feedQuery, likePost } = useCommunityPosts(
    filter === "all" ? undefined : filter,
  );

  return (
    <Screen>
      <View className="mb-4 mt-2">
        <CommunityFilterRow selected={filter} onSelect={setFilter} />
      </View>

      {feedQuery.isLoading ? (
        <LoadingBlock className="py-16" />
      ) : feedQuery.isError ? (
        <ErrorState onRetry={() => void feedQuery.refetch()} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-3.5 px-4"
          contentContainerStyle={{ paddingBottom: 48 }}
          refreshControl={
            <RefreshControl
              refreshing={feedQuery.isRefetching}
              onRefresh={() => void feedQuery.refetch()}
              tintColor={palette.primary}
            />
          }
          onEndReached={() => {
            if (feedQuery.hasNextPage && !feedQuery.isFetchingNextPage) {
              void feedQuery.fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.4}
          renderItem={({ item }) => (
            <CommunityUpdateCard post={item} onLike={likePost} />
          )}
          ListFooterComponent={<View style={{ height: 24 }} />}
          ListEmptyComponent={
            <EmptyState
              title="No updates yet"
              description="Admin announcements and neighbourhood news will show up here."
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
}
