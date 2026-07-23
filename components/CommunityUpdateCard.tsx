import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

import { Avatar } from "@/components/ui/Avatar";
import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { useRequireAuth } from "@/features/auth/useRequireAuth.hook";
import { cn } from "@/lib/cn.utils";
import { formatRelativeTime } from "@/lib/formatter.utils";
import { shareContent } from "@/lib/linking.utils";
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
  onLike?: (id: string) => void;
  className?: string;
}

/** Feed card for v1 — like + share only (no post detail screen). */
export function CommunityUpdateCard({
  post,
  onLike,
  className,
}: ICommunityUpdateCardProps) {
  const { requireAuth } = useRequireAuth();
  const isUrdu = post.contentIsUrdu ?? hasUrduScript(post.content);
  const likeCount = post.likeCount;

  return (
    <View
      className={cn(
        "rounded-card border border-cream/10 bg-surface p-3.5",
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
        numberOfLines={5}
      >
        {post.content}
      </Text>

      <View className="mt-3 flex-row items-center justify-between gap-3 border-t border-cream/10 pt-2.5">
        <Pressable
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={post.isLikedByMe ? "Unlike" : "Like"}
          disabled={!onLike}
          onPress={() => requireAuth(() => onLike?.(post.id))}
          className="flex-row items-center gap-1.5 active:opacity-70"
        >
          <SymbolView
            name={{
              ios: post.isLikedByMe ? "heart.fill" : "heart",
              android: post.isLikedByMe ? "favorite" : "favorite_border",
              web: "favorite",
            }}
            size={14}
            tintColor={post.isLikedByMe ? palette.primary : palette.muted}
          />
          <Text
            variant="caption"
            tone={post.isLikedByMe ? "primary" : "muted"}
            weight={post.isLikedByMe ? "semibold" : "medium"}
          >
            {likeCount}
          </Text>
        </Pressable>

        <Pressable
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Share"
          onPress={() => void shareContent(post.content)}
          className="flex-row items-center gap-1.5 active:opacity-70"
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
          <Text variant="caption" tone="muted">
            Share
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
