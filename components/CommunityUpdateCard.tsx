import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

import { Avatar } from "@/components/ui/Avatar";
import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { toImageSource } from "@/data/mocks/mock.utils";
import { cn } from "@/lib/cn.utils";
import { formatRelativeTime } from "@/lib/formatter.utils";
import { shareContent } from "@/lib/linking.utils";
import { href } from "@/lib/navigation.utils";
import { hasUrduScript } from "@/lib/text.utils";
import type { ICommunityPost } from "@/types/community.types";

interface ICommunityUpdateCardProps {
  post: ICommunityPost;
  width: number;
  className?: string;
}

const THUMB_SIZE = 88;

export function CommunityUpdateCard({
  post,
  width,
  className,
}: ICommunityUpdateCardProps) {
  const router = useRouter();
  const isUrdu = post.contentIsUrdu ?? hasUrduScript(post.content);
  const reactions = post.reactions ?? [];
  const image = post.imageUrls[0];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(href(`/community/${post.id}`))}
      style={{ width }}
      className={cn(
        "rounded-card border border-cream/10 bg-surface p-4",
        className,
      )}
    >
      <View className="mb-3 flex-row items-center gap-3">
        {post.user.isAdmin ? (
          <Image
            source={require("@/assets/images/logo.png")}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: palette.surface,
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
                size={14}
                tintColor={palette.primary}
              />
            ) : null}
          </View>
          <Text variant="caption" tone="muted">
            {formatRelativeTime(post.createdAt)}
          </Text>
        </View>
      </View>

      <View className="mb-3 flex-row gap-3">
        <Text
          variant="bodySmall"
          isUrdu={isUrdu}
          className={cn("min-w-0 flex-1", isUrdu ? "text-right" : "text-left")}
          numberOfLines={4}
        >
          {post.content}
        </Text>
        {image ? (
          <Image
            source={toImageSource(image)}
            style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
            className="rounded-lg bg-background"
            contentFit="cover"
          />
        ) : null}
      </View>

      <View className="flex-row items-center justify-between gap-2">
        <View className="min-w-0 flex-1 flex-row flex-wrap items-center gap-2">
          {reactions.map((reaction) => (
            <View
              key={reaction.emoji}
              className="flex-row items-center gap-1 rounded-chip border border-cream/10 bg-background/40 px-2 py-1"
            >
              <Text variant="caption">{reaction.emoji}</Text>
              <Text variant="caption" tone="muted">
                {reaction.count}
              </Text>
            </View>
          ))}
        </View>

        <View className="flex-row items-center gap-3">
          <View className="flex-row items-center gap-1">
            <SymbolView
              name={{
                ios: "bubble.right",
                android: "chat_bubble_outline",
                web: "chat",
              }}
              size={16}
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
            className="flex-row items-center gap-1 active:opacity-70"
          >
            <SymbolView
              name={{
                ios: "square.and.arrow.up",
                android: "share",
                web: "share",
              }}
              size={16}
              tintColor={palette.muted}
            />
            <Text variant="caption" tone="muted">
              Share
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}
