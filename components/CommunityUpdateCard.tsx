import { SymbolView } from "expo-symbols";
import { ActivityIndicator, Pressable, View } from "react-native";

import { Avatar } from "@/components/ui/Avatar";
import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { useRequireAuth } from "@/features/auth/useRequireAuth.hook";
import { cn } from "@/lib/cn.utils";
import { formatRelativeTime } from "@/lib/formatter.utils";
import { shareAppLink } from "@/lib/linking.utils";
import { hasUrduScript } from "@/lib/text.utils";
import {
  POST_CATEGORY_LABELS,
  type ICommunityPost,
} from "@/types/community.types";

interface ICommunityUpdateCardProps {
  post: ICommunityPost;
  onLike?: (id: string) => void;
  canManage?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  className?: string;
}

/** Feed card for v1 — like + share; owner/admin edit/delete (no detail screen). */
export function CommunityUpdateCard({
  post,
  onLike,
  canManage = false,
  onEdit,
  onDelete,
  isDeleting = false,
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
            {POST_CATEGORY_LABELS[post.category]}
          </Text>
        </View>
        <Text variant="caption" tone="muted">
          {formatRelativeTime(post.createdAt)}
        </Text>
      </View>

      <View className="mb-2.5 flex-row items-center gap-2.5">
        <Avatar
          uri={post.user.avatarUrl}
          name={post.user.fullName}
          size="sm"
        />
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
          {post.isPinned ? (
            <Text variant="caption" tone="primary" weight="semibold">
              Pinned
            </Text>
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

      <View className="mt-3 flex-row items-center border-t border-cream/10 pt-2.5">
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

        <View className="mx-3 h-1 w-1 rounded-full bg-muted" />

        <Pressable
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Share"
          onPress={() => void shareAppLink("/community", "Jevan Hana Community")}
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

        <View className="flex-1" />

        {canManage ? (
          <View className="flex-row items-center gap-0.5">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Edit Post"
              disabled={isDeleting}
              hitSlop={8}
              onPress={onEdit}
              className="h-8 w-8 items-center justify-center rounded-full active:bg-cream/10"
            >
              <SymbolView
                name={{
                  ios: "pencil",
                  android: "edit",
                  web: "edit",
                }}
                size={16}
                tintColor={palette.cream}
              />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Delete Post"
              disabled={isDeleting}
              hitSlop={8}
              onPress={onDelete}
              className="h-8 w-8 items-center justify-center rounded-full active:bg-cream/10"
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color={palette.error} />
              ) : (
                <SymbolView
                  name={{
                    ios: "trash",
                    android: "delete",
                    web: "delete",
                  }}
                  size={16}
                  tintColor={palette.error}
                />
              )}
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
}
