import { ScrollView, View } from "react-native";

import {
  NEARBY_HIGHLIGHT_CARD_GAP,
  NEARBY_HIGHLIGHT_CARD_WIDTH,
} from "@/components/NearbyHighlightCard";
import {
  Skeleton,
  SkeletonCard,
  SkeletonCircle,
} from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn.utils";

const LIST_IMAGE_HEIGHT = 152;
const NEARBY_IMAGE_HEIGHT = 128;

interface ICountProps {
  count?: number;
  className?: string;
}

/** Explore / search / saved — mirrors BusinessCard list variant. */
export function BusinessCardSkeleton({ className }: { className?: string }) {
  return (
    <SkeletonCard className={className}>
      <Skeleton className="w-full rounded-none" height={LIST_IMAGE_HEIGHT} />
      <View className="gap-2.5 px-3.5 py-3">
        <Skeleton width="58%" height={16} />
        <Skeleton width="34%" height={12} />
        <Skeleton width="72%" height={12} />
        <View className="mt-1 flex-row items-center gap-2">
          <Skeleton width={56} height={12} />
          <Skeleton width={40} height={12} />
        </View>
      </View>
    </SkeletonCard>
  );
}

export function BusinessListSkeleton({ count = 3, className }: ICountProps) {
  return (
    <View className={cn("gap-4", className)}>
      {Array.from({ length: count }, (_, i) => (
        <BusinessCardSkeleton key={`biz-skel-${i}`} />
      ))}
    </View>
  );
}

/** Home nearby carousel — mirrors NearbyHighlightCard. */
export function NearbyHighlightsSkeleton({ className }: { className?: string }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: NEARBY_HIGHLIGHT_CARD_GAP,
        paddingHorizontal: 2,
      }}
      className={className}
    >
      {Array.from({ length: 3 }, (_, i) => (
        <SkeletonCard key={`nearby-skel-${i}`}>
          <View style={{ width: NEARBY_HIGHLIGHT_CARD_WIDTH }}>
            <Skeleton
              className="w-full rounded-none"
              height={NEARBY_IMAGE_HEIGHT}
            />
            <View className="gap-1.5 px-3.5 py-2.5">
              <Skeleton width="70%" height={14} />
              <Skeleton width="42%" height={11} />
              <Skeleton width="55%" height={11} />
            </View>
          </View>
        </SkeletonCard>
      ))}
    </ScrollView>
  );
}

/** Community feed / Home updates — mirrors CommunityUpdateCard. */
export function CommunityCardSkeleton({ className }: { className?: string }) {
  return (
    <SkeletonCard className={cn("p-3.5", className)}>
      <View className="mb-2.5 flex-row items-center justify-between">
        <Skeleton width={88} height={18} className="rounded-chip" />
        <Skeleton width={48} height={12} />
      </View>
      <View className="mb-2.5 flex-row items-center gap-2.5">
        <SkeletonCircle size={36} />
        <View className="flex-1 gap-1.5">
          <Skeleton width="48%" height={13} />
          <Skeleton width="28%" height={11} />
        </View>
      </View>
      <View className="gap-2">
        <Skeleton width="100%" height={12} />
        <Skeleton width="92%" height={12} />
        <Skeleton width="64%" height={12} />
      </View>
      <View className="mt-3 flex-row items-center gap-4">
        <Skeleton width={56} height={14} />
        <Skeleton width={56} height={14} />
      </View>
    </SkeletonCard>
  );
}

export function CommunityFeedSkeleton({ count = 4, className }: ICountProps) {
  return (
    <View className={cn("gap-3.5", className)}>
      {Array.from({ length: count }, (_, i) => (
        <CommunityCardSkeleton key={`post-skel-${i}`} />
      ))}
    </View>
  );
}

/** Events tab — mirrors EventCard proportions. */
export function EventCardSkeleton({ className }: { className?: string }) {
  return (
    <SkeletonCard className={cn("p-3.5", className)}>
      <View className="flex-row gap-3">
        <Skeleton width={64} height={72} className="rounded-xl" />
        <View className="min-w-0 flex-1 gap-2 pt-0.5">
          <Skeleton width="78%" height={16} />
          <Skeleton width="52%" height={12} />
          <Skeleton width="64%" height={12} />
        </View>
      </View>
      <View className="mt-3 flex-row gap-2 border-t border-cream/10 pt-3">
        <Skeleton className="flex-1" height={40} />
        <Skeleton className="flex-1" height={40} />
        <Skeleton className="flex-1" height={40} />
      </View>
    </SkeletonCard>
  );
}

export function EventListSkeleton({ count = 3, className }: ICountProps) {
  return (
    <View className={cn("gap-4", className)}>
      <Skeleton width={120} height={18} className="mb-1" />
      {Array.from({ length: count }, (_, i) => (
        <EventCardSkeleton key={`event-skel-${i}`} />
      ))}
    </View>
  );
}
