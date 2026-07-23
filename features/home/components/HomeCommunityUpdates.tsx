import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { View } from "react-native";

import { CommunityUpdateCard } from "@/components/CommunityUpdateCard";
import { ErrorState, LoadingBlock, SectionHeader } from "@/components/ui";
import { HomeSectionEmpty } from "@/features/home/components/HomeSectionEmpty";
import { cn } from "@/lib/cn.utils";
import { href } from "@/lib/navigation.utils";
import {
  getAdminCommunityHighlights,
  toggleLikePost,
} from "@/lib/services/community.service";

const POST_LIMIT = 5;

interface IHomeCommunityUpdatesProps {
  className?: string;
}

export function HomeCommunityUpdates({ className }: IHomeCommunityUpdatesProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const postsQuery = useQuery({
    queryKey: ["home-community-updates", POST_LIMIT],
    queryFn: () => getAdminCommunityHighlights(POST_LIMIT),
  });

  const likeMutation = useMutation({
    mutationFn: toggleLikePost,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["home-community-updates"],
      });
      void queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      void queryClient.invalidateQueries({ queryKey: ["search"] });
      void queryClient.invalidateQueries({ queryKey: ["my-posts"] });
    },
  });

  const posts = postsQuery.data ?? [];
  const goToCommunity = () => router.push(href("/(tabs)/community"));

  if (postsQuery.isLoading) {
    return (
      <View className={cn(className)}>
        <SectionHeader title="Community Updates" />
        <LoadingBlock className="py-10" />
      </View>
    );
  }

  if (postsQuery.isError) {
    return (
      <View className={cn(className)}>
        <SectionHeader title="Community Updates" />
        <ErrorState
          className="px-2 py-8"
          onRetry={() => void postsQuery.refetch()}
        />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View className={cn(className)}>
        <SectionHeader
          title="Community Updates"
          actionLabel="View All"
          onActionPress={goToCommunity}
        />
        <HomeSectionEmpty message="No community updates yet." />
      </View>
    );
  }

  return (
    <View className={cn(className)}>
      <SectionHeader
        title="Community Updates"
        actionLabel="View All"
        onActionPress={goToCommunity}
      />

      <View className="gap-3">
        {posts.map((post) => (
          <CommunityUpdateCard
            key={post.id}
            post={post}
            onLike={(id) => likeMutation.mutate(id)}
          />
        ))}
      </View>
    </View>
  );
}
