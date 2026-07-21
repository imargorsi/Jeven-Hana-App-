import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { cn } from "@/lib/cn.utils";

interface ISkeletonProps {
  className?: string;
}

export function Skeleton({ className }: ISkeletonProps) {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.8, { duration: 800 }), -1, true);
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={style}
      className={cn("rounded-md bg-cream/10", className)}
    />
  );
}

export function SkeletonCard({ className }: ISkeletonProps) {
  return (
    <View className={cn("rounded-card bg-surface p-4", className)}>
      <Skeleton className="mb-3 h-32 w-full rounded-lg" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </View>
  );
}
