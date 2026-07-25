import { Pressable, View } from "react-native";

import { cn } from "@/lib/cn.utils";

interface ICarouselDotsProps {
  count: number;
  activeIndex: number;
  onDotPress?: (index: number) => void;
  className?: string;
  /** Accessibility label prefix, e.g. "Go to Slide" */
  labelPrefix?: string;
  /**
   * `pill` — elongated active indicator (Nearby Highlights).
   * `round` — equal circular dots (Home hero mock).
   */
  variant?: "pill" | "round";
}

/** Shared pagination dots for home carousels. */
export function CarouselDots({
  count,
  activeIndex,
  onDotPress,
  className,
  labelPrefix = "Go to Slide",
  variant = "pill",
}: ICarouselDotsProps) {
  if (count < 2) return null;

  return (
    <View
      className={cn(
        "mt-4 flex-row items-center justify-center gap-2",
        className,
      )}
    >
      {Array.from({ length: count }, (_, index) => {
        const isActive = index === activeIndex;

        return (
          <Pressable
            key={index}
            accessibilityRole="button"
            accessibilityLabel={`${labelPrefix} ${index + 1}`}
            accessibilityState={{ selected: isActive }}
            hitSlop={10}
            disabled={!onDotPress}
            onPress={() => onDotPress?.(index)}
            className={cn(
              "rounded-full",
              variant === "round"
                ? isActive
                  ? "h-2 w-2 bg-primary"
                  : "h-2 w-2 bg-cream/30"
                : isActive
                  ? "h-2 w-5 bg-primary"
                  : "h-2 w-2 bg-cream/35",
            )}
          />
        );
      })}
    </View>
  );
}
