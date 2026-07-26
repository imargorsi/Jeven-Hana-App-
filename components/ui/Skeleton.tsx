import type { ReactNode } from "react";
import { useEffect } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";
import { withAlpha } from "@/lib/color.utils";

interface ISkeletonProps {
  className?: string;
  style?: StyleProp<ViewStyle>;
  /** Fixed width; omit for flex / full width via className. */
  width?: number | `${number}%`;
  height?: number;
}

/**
 * Soft pulsing bone for content-shaped loading.
 * Uses cream-on-surface so skeletons read as layout, not a spinner.
 */
export function Skeleton({
  className,
  style,
  width,
  height = 14,
}: ISkeletonProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.38, 0.72]),
  }));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={cn("overflow-hidden rounded-md", className)}
      style={[
        {
          width,
          height,
          backgroundColor: withAlpha(palette.cream, 0.12),
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

interface ISkeletonCircleProps {
  size?: number;
  className?: string;
}

export function SkeletonCircle({ size = 40, className }: ISkeletonCircleProps) {
  return (
    <Skeleton
      className={cn("rounded-full", className)}
      width={size}
      height={size}
    />
  );
}

interface ISkeletonBlockProps {
  className?: string;
  children: ReactNode;
}

/** Surface card shell for skeleton layouts (matches card chrome). */
export function SkeletonCard({ className, children }: ISkeletonBlockProps) {
  return (
    <View
      className={cn(
        "overflow-hidden rounded-card border border-cream/10 bg-surface",
        className,
      )}
    >
      {children}
    </View>
  );
}
