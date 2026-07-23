import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

import { Avatar } from "@/components/ui/Avatar";
import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";
import { formatRelativeTime } from "@/lib/formatter.utils";
import { shareContent } from "@/lib/linking.utils";
import { href } from "@/lib/navigation.utils";
import { hasUrduScript } from "@/lib/text.utils";
import type { ICommunityPost } from "@/types/community.types";

const CATEGORY_LABEL: Record<ICommunityPost["category"], string> = {
  announcement: "Announcement",
  news: "News",
  "local-update": "Local update",
  recommendation: "Recommendation",
  "lost-found": "Lost & found",
  general: "General",
};

interface ICommunityUpdateCardProps {
  post: ICommunityPost;
  width: number;
  className?: string;
}

export function CommunityUpdateCard({
  post,
  width,
  className,
}: ICommunityUpdateCardProps) {
  const router = useRouter();
  const isUrdu = post.contentIsUrdu ?? hasUrduScript(post.content);
  const reactions = post.reactions ?? [];
  const totalReactions = reactions.reduce((sum, item) => sum + item.count, 0);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(href(`/community/${post.id}`))}
      style={{ width }}
      className={cn(
        "rounded-card border border-cream/10 bg-surface p-3.5 active:opacity-95",
        className,
      )}
    >
      <View className="mb-2.5 flex-row items-center justify-between gap-2">
        <View className="rounded-chip bg-primary/15 px-2 py-0.5">
          <Text variant="caption" weight="semibold" tone="primary">
            {CATEGORY_LABEL[post.category]}
          </Text>
        </View>
        <Text variant="caption" tone="muted">
          {formatRelativeTime(post.createdAt)}
        </Text>
      </View>

      <View className="mb-2.5 flex-row items-center gap-2.5">
        {post.user.isAdmin ? (
          <Image
            source={require("@/assets/images/logo.png")}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
            }}
            className="bg-background"
            contentFit="contain"
            accessibilityLabel="Jevan Hana logo"
          />
        ) : (
          <Avatar
            uri={post.user.avatarUrl}
            name={post.user.fullName}
            size="sm"
          />
        )}
        <View className="min-w-0 flex-1 flex-row items-center gap-1.5">
          <Text
            variant="bodySmall"
            weight="semibold"
            numberOfLines={1}
            className="shrink"
          >
            {post.user.fullName}
          </Text>
          {post.user.isAdmin ? (
            <SymbolView
              name={{
                ios: "checkmark.seal.fill",
                android: "verified",
                web: "verified",
              }}
              size={13}
              tintColor={palette.primary}
            />
          ) : null}
        </View>
      </View>

      <Text
        variant="bodySmall"
        isUrdu={isUrdu}
        className={cn(isUrdu ? "text-right" : "text-left")}
        numberOfLines={3}
      >
        {post.content}
      </Text>

      <View className="mt-3 flex-row items-center justify-between gap-3 border-t border-cream/10 pt-2.5">
        <View className="flex-row items-center gap-1.5">
          <SymbolView
            name={{
              ios: "heart",
              android: "favorite_border",
              web: "favorite",
            }}
            size={14}
            tintColor={palette.muted}
          />
          <Text variant="caption" tone="muted">
            {totalReactions > 0 ? totalReactions : post.likeCount}
          </Text>
        </View>

        <View className="flex-row items-center gap-3.5">
          <View className="flex-row items-center gap-1">
            <SymbolView
              name={{
                ios: "bubble.right",
                android: "chat_bubble_outline",
                web: "chat",
              }}
              size={14}
              tintColor={palette.muted}
            />
            <Text variant="caption" tone="muted">
              {post.commentCount}
            </Text>
          </View>
          <Pressable
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Share"
            onPress={(e) => {
              e.stopPropagation?.();
              void shareContent(post.content);
            }}
            className="active:opacity-70"
          >
            <SymbolView
              name={{
                ios: "square.and.arrow.up",
                android: "share",
                web: "share",
              }}
              size={14}
              tintColor={palette.muted}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}
