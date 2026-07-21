import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

import { Avatar } from "@/components/ui/Avatar";
import { AdminBadge, PinnedBadge } from "@/components/ui/Badges";
import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";
import { formatRelativeTime } from "@/lib/formatter.utils";
import { shareContent } from "@/lib/linking.utils";
import { href } from "@/lib/navigation.utils";
import type { ICommunityPost } from "@/types/community.types";

const categoryLabel: Record<ICommunityPost["category"], string> = {
  announcement: "Announcement",
  news: "News",
  "local-update": "Local update",
  recommendation: "Recommendation",
  "lost-found": "Lost & found",
  general: "General",
};

interface ICommunityPostCardProps {
  post: ICommunityPost;
  onLike?: (id: string) => void;
  className?: string;
}

export function CommunityPostCard({
  post,
  onLike,
  className,
}: ICommunityPostCardProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(href(`/community/${post.id}`))}
      className={cn(
        "rounded-card border border-cream/10 bg-surface p-4",
        className,
      )}
    >
      <View className="mb-3 flex-row items-center gap-3">
        <Avatar uri={post.user.avatarUrl} name={post.user.fullName} />
        <View className="flex-1">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text variant="bodySmall" weight="semibold">
              {post.user.fullName}
            </Text>
            {post.user.isAdmin ? <AdminBadge /> : null}
            {post.isPinned ? <PinnedBadge /> : null}
          </View>
          <Text variant="caption" tone="muted">
            {formatRelativeTime(post.createdAt)} · {categoryLabel[post.category]}
          </Text>
        </View>
      </View>

      <Text variant="body" className="mb-3">
        {post.content}
      </Text>

      {post.imageUrls[0] ? (
        <Image
          source={{ uri: post.imageUrls[0] }}
          className="mb-3 h-48 w-full rounded-lg bg-background"
          contentFit="cover"
        />
      ) : null}

      <View className="flex-row items-center gap-5">
        <Pressable
          hitSlop={8}
          className="flex-row items-center gap-1.5"
          onPress={(e) => {
            e.stopPropagation?.();
            onLike?.(post.id);
          }}
        >
          <SymbolView
            name={{
              ios: post.isLikedByMe ? "heart.fill" : "heart",
              android: post.isLikedByMe ? "favorite" : "favorite_border",
              web: "favorite",
            }}
            size={20}
            tintColor={post.isLikedByMe ? palette.error : palette.cream}
          />
          <Text variant="caption">{post.likeCount}</Text>
        </Pressable>
        <View className="flex-row items-center gap-1.5">
          <SymbolView
            name={{
              ios: "bubble.right",
              android: "chat_bubble_outline",
              web: "chat",
            }}
            size={20}
            tintColor={palette.cream}
          />
          <Text variant="caption">{post.commentCount}</Text>
        </View>
        <Pressable
          hitSlop={8}
          onPress={(e) => {
            e.stopPropagation?.();
            void shareContent(post.content);
          }}
        >
          <SymbolView
            name={{
              ios: "square.and.arrow.up",
              android: "share",
              web: "share",
            }}
            size={20}
            tintColor={palette.cream}
          />
        </Pressable>
      </View>
    </Pressable>
  );
}
