import { useAuth } from "@clerk/expo";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { View } from "react-native";

import { CommunityUpdateCard } from "@/components/CommunityUpdateCard";
import {
  CommunityFeedSkeleton,
  ErrorState,
  SectionHeader,
} from "@/components/ui";
import { useCommunityManage } from "@/features/community/useCommunityManage.hook";
import { useTogglePostLike } from "@/features/community/useTogglePostLike.hook";
import { HomeSectionEmpty } from "@/features/home/components/HomeSectionEmpty";
import { getApiErrorMessage } from "@/lib/apiError.utils";
import { cn } from "@/lib/cn.utils";
import { href } from "@/lib/navigation.utils";
import { getAdminCommunityHighlights } from "@/lib/services/community.service";

const POST_LIMIT = 6;

interface IHomeCommunityUpdatesProps {
  className?: string;
}

export function HomeCommunityUpdates({ className }: IHomeCommunityUpdatesProps) {
  const { getToken } = useAuth();
  const router = useRouter();
  const { canManage, openEdit, confirmDelete, deletingId } =
    useCommunityManage();
  const { likePost } = useTogglePostLike();

  const postsQuery = useQuery({
    queryKey: ["home-community-updates", POST_LIMIT],
    queryFn: () => getAdminCommunityHighlights(POST_LIMIT, getToken),
  });

  const posts = postsQuery.data ?? [];
  const goToCommunity = () => router.push(href("/(tabs)/community"));

  if (postsQuery.isLoading) {
    return (
      <View className={cn(className)}>
        <SectionHeader isUrdu title="کمیونٹی اپڈیٹس" />
        <CommunityFeedSkeleton count={3} />
      </View>
    );
  }

  if (postsQuery.isError) {
    return (
      <View className={cn(className)}>
        <SectionHeader isUrdu title="کمیونٹی اپڈیٹس" />
        <ErrorState
          className="px-2 py-8"
          description={getApiErrorMessage(postsQuery.error)}
          onRetry={() => void postsQuery.refetch()}
        />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View className={cn(className)}>
        <SectionHeader
          isUrdu
          title="کمیونٹی اپڈیٹس"
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
        isUrdu
        title="کمیونٹی اپڈیٹس"
        actionLabel="View All"
        onActionPress={goToCommunity}
      />

      <View className="gap-3">
        {posts.map((post) => (
          <CommunityUpdateCard
            key={post.id}
            post={post}
            onLike={likePost}
            canManage={canManage(post)}
            onEdit={() => openEdit(post.id)}
            onDelete={() => confirmDelete(post)}
            isDeleting={deletingId === post.id}
          />
        ))}
      </View>
    </View>
  );
}
