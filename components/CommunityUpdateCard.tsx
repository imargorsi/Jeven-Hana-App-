import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { ActivityIndicator, Pressable, View } from "react-native";

import { ReportButton } from "@/components/ReportButton";
import { Avatar } from "@/components/ui/Avatar";
import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { useRequireAuth } from "@/features/auth/useRequireAuth.hook";
import { cn } from "@/lib/cn.utils";
import { formatRelativeTime } from "@/lib/formatter.utils";
import { toImageSource } from "@/lib/image.utils";
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

/**
 * Feed photo frame — 4:3 matches common social feed photos (and our picker crop).
 * Full-bleed inside the card like Facebook / Instagram feed media.
 */
const FEED_IMAGE_ASPECT = 4 / 3;

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
  const imageUrl = post.imageUrl?.trim() || null;

  return (
    <View
      className={cn(
        "overflow-hidden rounded-card border border-cream/10 bg-surface",
        className,
      )}
    >
      <View className="px-3.5 pt-3.5">
        <View className="mb-3 flex-row items-center gap-2.5">
          <Avatar
            uri={post.user.avatarUrl}
            name={post.user.fullName}
            size="sm"
          />
          <View className="min-w-0 flex-1">
            <View className="flex-row items-center gap-1.5">
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
            <View className="mt-0.5 flex-row items-center gap-1.5">
              <View className="rounded-chip bg-primary/15 px-2 py-0.5">
                <Text variant="caption" weight="semibold" tone="primary">
                  {POST_CATEGORY_LABELS[post.category]}
                </Text>
              </View>
              <Text variant="caption" tone="muted">
                · {formatRelativeTime(post.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        <Text
          variant="bodySmall"
          isUrdu={isUrdu}
          className={cn("mb-3", isUrdu ? "text-right" : "text-left")}
          numberOfLines={5}
        >
          {post.content}
        </Text>
      </View>

      {imageUrl ? (
        <View className="bg-background">
          <Image
            source={toImageSource(imageUrl)}
            style={{ width: "100%", aspectRatio: FEED_IMAGE_ASPECT }}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={200}
            accessibilityLabel="Post Photo"
          />
        </View>
      ) : null}

      <View className="flex-row items-center px-3.5 py-2.5">
        <Pressable
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={post.isLikedByMe ? "Unlike" : "Like"}
          disabled={!onLike}
          onPress={() => requireAuth(() => onLike?.(post.id))}
          className="flex-row items-center gap-1.5 rounded-full px-1 py-1 active:opacity-70"
        >
          <SymbolView
            name={{
              ios: post.isLikedByMe ? "heart.fill" : "heart",
              android: post.isLikedByMe ? "favorite" : "favorite_border",
              web: "favorite",
            }}
            size={18}
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

        <View className="mx-2.5 h-1 w-1 rounded-full bg-muted/80" />

        <Pressable
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Share"
          onPress={() => void shareAppLink("/community", "Jevan Hana Community")}
          className="flex-row items-center gap-1.5 rounded-full px-1 py-1 active:opacity-70"
        >
          <SymbolView
            name={{
              ios: "square.and.arrow.up",
              android: "share",
              web: "share",
            }}
            size={17}
            tintColor={palette.muted}
          />
          <Text variant="caption" tone="muted">
            Share
          </Text>
        </Pressable>

        {!canManage ? (
          <>
            <View className="mx-2.5 h-1 w-1 rounded-full bg-muted/80" />
            <ReportButton targetType="post" targetId={post.id} />
          </>
        ) : null}

        <View className="flex-1" />

        {canManage ? (
          <View className="flex-row items-center gap-0.5">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Edit Post"
              disabled={isDeleting}
              hitSlop={8}
              onPress={onEdit}
              className="h-9 w-9 items-center justify-center rounded-full active:bg-cream/10"
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
              className="h-9 w-9 items-center justify-center rounded-full active:bg-cream/10"
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
