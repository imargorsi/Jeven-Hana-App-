import { useAuth } from "@clerk/expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert, View } from "react-native";

import { CommunityUpdateCard } from "@/components/CommunityUpdateCard";
import { ErrorState, LoadingBlock, SectionHeader } from "@/components/ui";
import { useCommunityManage } from "@/features/community/useCommunityManage.hook";
import { HomeSectionEmpty } from "@/features/home/components/HomeSectionEmpty";
import { getApiErrorMessage } from "@/lib/apiError.utils";
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
  const { getToken } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { canManage, openEdit, confirmDelete, deletingId } =
    useCommunityManage();

  const postsQuery = useQuery({
    queryKey: ["home-community-updates", POST_LIMIT],
    queryFn: () => getAdminCommunityHighlights(POST_LIMIT, getToken),
  });

  const likeMutation = useMutation({
    mutationFn: (id: string) => toggleLikePost(id, getToken),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["home-community-updates"],
      });
      void queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      void queryClient.invalidateQueries({ queryKey: ["search"] });
      void queryClient.invalidateQueries({ queryKey: ["my-posts"] });
    },
    onError: (error) => {
      Alert.alert("Could not update", getApiErrorMessage(error));
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
