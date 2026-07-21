import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, RefreshControl } from "react-native";

import { CategoryChip } from "@/components/CategoryChip";
import { CommunityPostCard } from "@/components/CommunityPostCard";
import {
  EmptyState,
  ErrorState,
  LoadingBlock,
  Screen,
  Text,
} from "@/components/ui";
import { palette } from "@/constants/Colors";
import { useCommunityPosts } from "@/features/community/useCommunityPosts.hook";
import { href } from "@/lib/navigation.utils";
import type { TPostCategory } from "@/types/community.types";

const FILTERS: { key: TPostCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "announcement", label: "Announcements" },
  { key: "news", label: "News" },
  { key: "local-update", label: "Updates" },
  { key: "recommendation", label: "Tips" },
  { key: "lost-found", label: "Lost & found" },
];

export default function CommunityTabScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<TPostCategory | "all">("all");
  const { posts, feedQuery, likePost } = useCommunityPosts(
    filter === "all" ? undefined : filter,
  );

  return (
    <Screen
      title="Community"
      subtitle="کمیونٹی فیڈ"
      headerRight={
        <Pressable
          onPress={() => router.push(href("/community/create"))}
          className="rounded-button bg-primary px-4 py-2"
        >
          <Text variant="label" tone="background" weight="semibold">
            Create
          </Text>
        </Pressable>
      }
    >
      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        className="max-h-12 px-4"
        contentContainerClassName="items-center"
        renderItem={({ item }) => (
          <CategoryChip
            label={item.label}
            isActive={filter === item.key}
            onPress={() => setFilter(item.key)}
          />
        )}
      />

      {feedQuery.isLoading ? (
        <LoadingBlock />
      ) : feedQuery.isError ? (
        <ErrorState onRetry={() => void feedQuery.refetch()} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-3 px-4 pb-10 pt-3"
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
            <CommunityPostCard post={item} onLike={likePost} />
          )}
          ListEmptyComponent={
            <EmptyState
              title="No posts yet"
              description="Be the first to share a local update."
              actionLabel="Create post"
              onAction={() => router.push(href("/community/create"))}
            />
          }
        />
      )}
    </Screen>
  );
}
