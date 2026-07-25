import { SymbolView } from "expo-symbols";
import { ActivityIndicator, Pressable, View } from "react-native";

import { Avatar } from "@/components/ui/Avatar";
import { RatingDisplay } from "@/components/ui/RatingDisplay";
import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";
import { withAlpha } from "@/lib/color.utils";
import { formatRelativeTime } from "@/lib/formatter.utils";
import type { IReview } from "@/types/common.types";

interface IBusinessReviewListProps {
  reviews: IReview[];
  canManage?: (review: IReview) => boolean;
  onEdit?: (review: IReview) => void;
  onDelete?: (review: IReview) => void;
  deletingId?: string;
  className?: string;
}

export function BusinessReviewList({
  reviews,
  canManage,
  onEdit,
  onDelete,
  deletingId,
  className,
}: IBusinessReviewListProps) {
  if (reviews.length === 0) {
    return (
      <View
        className={cn(
          "rounded-card border border-dashed border-cream/15 bg-surface/40 px-4 py-8",
          className,
        )}
      >
        <Text variant="bodySmall" tone="muted" className="text-center">
          No Reviews Yet
        </Text>
        <Text variant="caption" tone="muted" className="mt-1.5 text-center">
          Be the first neighbour to share how this place was.
        </Text>
      </View>
    );
  }

  return (
    <View className={cn("gap-3", className)}>
      {reviews.map((review) => {
        const showManage = canManage?.(review) ?? false;
        const isDeleting = deletingId === review.id;

        return (
          <View
            key={review.id}
            className="rounded-card border border-cream/10 bg-surface p-3.5"
          >
            <View className="mb-2 flex-row items-center gap-2.5">
              <Avatar
                uri={review.authorAvatarUrl}
                name={review.authorName}
                size="sm"
              />
              <View className="min-w-0 flex-1">
                <Text
                  variant="bodySmall"
                  weight="semibold"
                  numberOfLines={1}
                >
                  {review.authorName}
                </Text>
                <Text variant="caption" tone="muted" className="mt-0.5">
                  {formatRelativeTime(review.createdAt)}
                </Text>
              </View>

              <View className="shrink-0 flex-row items-center gap-1.5">
                <RatingDisplay rating={review.rating} />
                {showManage ? (
                  <>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Edit Review"
                      disabled={isDeleting}
                      onPress={() => onEdit?.(review)}
                      hitSlop={4}
                      className="h-7 w-7 items-center justify-center rounded-full active:opacity-80"
                      style={{
                        backgroundColor: withAlpha(palette.cream, 0.1),
                        borderWidth: 1,
                        borderColor: withAlpha(palette.cream, 0.2),
                      }}
                    >
                      <SymbolView
                        name={{
                          ios: "pencil",
                          android: "edit",
                          web: "edit",
                        }}
                        size={12}
                        tintColor={palette.cream}
                      />
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Delete Review"
                      disabled={isDeleting}
                      onPress={() => onDelete?.(review)}
                      hitSlop={4}
                      className="h-7 w-7 items-center justify-center rounded-full active:opacity-80"
                      style={{
                        backgroundColor: withAlpha(palette.error, 0.12),
                        borderWidth: 1,
                        borderColor: withAlpha(palette.error, 0.35),
                      }}
                    >
                      {isDeleting ? (
                        <ActivityIndicator
                          size="small"
                          color={palette.error}
                        />
                      ) : (
                        <SymbolView
                          name={{
                            ios: "trash",
                            android: "delete",
                            web: "delete",
                          }}
                          size={12}
                          tintColor={palette.error}
                        />
                      )}
                    </Pressable>
                  </>
                ) : null}
              </View>
            </View>

            <Text variant="bodySmall" tone="muted">
              {review.comment}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
