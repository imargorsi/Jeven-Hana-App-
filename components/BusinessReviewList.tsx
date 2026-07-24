import { View } from "react-native";

import { Avatar } from "@/components/ui/Avatar";
import { RatingDisplay } from "@/components/ui/RatingDisplay";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn.utils";
import { formatRelativeTime } from "@/lib/formatter.utils";
import type { IReview } from "@/types/common.types";

interface IBusinessReviewListProps {
  reviews: IReview[];
  className?: string;
}

export function BusinessReviewList({
  reviews,
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
          No reviews yet. Writing reviews comes in part 2.
        </Text>
      </View>
    );
  }

  return (
    <View className={cn("gap-3", className)}>
      {reviews.map((review) => (
        <View
          key={review.id}
          className="rounded-card border border-cream/10 bg-surface p-4"
        >
          <View className="mb-2.5 flex-row items-start gap-3">
            <Avatar name={review.authorName} size="sm" />
            <View className="min-w-0 flex-1">
              <View className="flex-row items-center justify-between gap-2">
                <Text
                  variant="bodySmall"
                  weight="semibold"
                  className="min-w-0 flex-1"
                  numberOfLines={1}
                >
                  {review.authorName}
                </Text>
                <RatingDisplay rating={review.rating} />
              </View>
              <Text variant="caption" tone="muted" className="mt-0.5">
                {formatRelativeTime(review.createdAt)}
              </Text>
            </View>
          </View>
          <Text variant="bodySmall" tone="muted">
            {review.comment}
          </Text>
        </View>
      ))}
    </View>
  );
}
