import { useQuery } from "@tanstack/react-query";
import { FlatList, View } from "react-native";

import { CommunityPostCard } from "@/components/CommunityPostCard";
import { EmptyState, ErrorState, LoadingBlock, Screen } from "@/components/ui";
import { getCommunityPosts } from "@/lib/services/community.service";

export default function MyPostsScreen() {
  const query = useQuery({
    queryKey: ["my-posts"],
    queryFn: () => getCommunityPosts({ userId: "user-1", limit: 40 }),
  });

  if (query.isLoading) {
    return (
      <Screen withSafeArea={false}>
        <LoadingBlock />
      </Screen>
    );
  }

  if (query.isError) {
    return (
      <Screen withSafeArea={false} className="px-4">
        <ErrorState onRetry={() => void query.refetch()} />
      </Screen>
    );
  }

  return (
    <Screen withSafeArea={false}>
      <FlatList
        data={query.data?.items ?? []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-3 px-4 pb-10 pt-2"
        renderItem={({ item }) => <CommunityPostCard post={item} />}
        ListEmptyComponent={
          <EmptyState
            title="No posts yet"
            description="Share something with the neighbourhood from Community."
          />
        }
        ItemSeparatorComponent={() => <View className="h-0" />}
      />
    </Screen>
  );
}
