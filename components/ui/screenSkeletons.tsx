import { View } from "react-native";

import {
  BusinessCardSkeleton,
  CommunityCardSkeleton,
  EventCardSkeleton,
} from "@/components/ui/listSkeletons";
import {
  Skeleton,
  SkeletonCard,
  SkeletonCircle,
} from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn.utils";

interface ICountProps {
  count?: number;
  className?: string;
}

/** Business detail — hero + body blocks. */
export function ListingDetailSkeleton({ className }: { className?: string }) {
  return (
    <View className={cn("pb-10", className)}>
      <Skeleton className="w-full rounded-none" height={220} />
      <View className="gap-3 px-4 pt-5">
        <Skeleton width="72%" height={22} />
        <Skeleton width="40%" height={14} />
        <View className="mt-2 flex-row gap-2">
          <Skeleton className="flex-1" height={44} />
          <Skeleton className="flex-1" height={44} />
          <Skeleton className="flex-1" height={44} />
        </View>
        <View className="mt-4 gap-2">
          <Skeleton width="100%" height={12} />
          <Skeleton width="95%" height={12} />
          <Skeleton width="80%" height={12} />
        </View>
        <View className="mt-6 gap-3">
          <Skeleton width={100} height={16} />
          <SkeletonCard className="gap-2 p-3.5">
            <Skeleton width="40%" height={12} />
            <Skeleton width="100%" height={12} />
            <Skeleton width="88%" height={12} />
          </SkeletonCard>
          <SkeletonCard className="gap-2 p-3.5">
            <Skeleton width="36%" height={12} />
            <Skeleton width="92%" height={12} />
          </SkeletonCard>
        </View>
      </View>
    </View>
  );
}

/** Notifications inbox rows. */
export function NotificationListSkeleton({
  count = 6,
  className,
}: ICountProps) {
  return (
    <View className={cn("gap-1 px-2 pt-2", className)}>
      {Array.from({ length: count }, (_, i) => (
        <View
          key={`notif-skel-${i}`}
          className="flex-row items-center gap-3 px-3 py-3.5"
        >
          <SkeletonCircle size={44} />
          <View className="min-w-0 flex-1 gap-2">
            <Skeleton width="70%" height={13} />
            <Skeleton width="92%" height={11} />
          </View>
          <Skeleton width={36} height={11} />
        </View>
      ))}
    </View>
  );
}

/** Search results while querying. */
export function SearchResultsSkeleton({ className }: { className?: string }) {
  return (
    <View className={cn("gap-3.5 px-4 pt-2", className)}>
      <BusinessCardSkeleton />
      <CommunityCardSkeleton />
      <EventCardSkeleton />
    </View>
  );
}

/** About / long-form content screen. */
export function AboutSkeleton({ className }: { className?: string }) {
  return (
    <View className={cn(className)}>
      <Skeleton className="w-full rounded-none" height={220} />
      <View className="gap-3 px-5 pt-6">
        <Skeleton width="55%" height={22} />
        <Skeleton width="100%" height={12} />
        <Skeleton width="96%" height={12} />
        <Skeleton width="88%" height={12} />
        <Skeleton width="100%" height={12} />
        <View className="mt-4 gap-2">
          <Skeleton width="40%" height={16} />
          <Skeleton width="100%" height={12} />
          <Skeleton width="90%" height={12} />
        </View>
      </View>
    </View>
  );
}

/** Edit / form screens while hydrating. */
export function FormScreenSkeleton({ className }: { className?: string }) {
  return (
    <View className={cn("gap-4 px-4 pt-6", className)}>
      <Skeleton width="42%" height={18} />
      <Skeleton className="w-full" height={48} />
      <Skeleton width="36%" height={18} />
      <Skeleton className="w-full" height={48} />
      <Skeleton width="48%" height={18} />
      <Skeleton className="w-full" height={120} />
      <Skeleton className="mt-4 w-full" height={48} />
    </View>
  );
}

/** Auth / bootstrap gate — calm centered pulse, not a spinner. */
export function BootstrapSkeleton({ className }: { className?: string }) {
  return (
    <View
      className={cn("flex-1 items-center justify-center gap-3", className)}
      accessibilityLabel="Loading"
    >
      <Skeleton width={72} height={72} className="rounded-2xl" />
      <Skeleton width={120} height={12} />
    </View>
  );
}
