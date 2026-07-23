import { Pressable, View } from "react-native";

import { cn } from "@/lib/cn.utils";

interface ICarouselDotsProps {
  count: number;
  activeIndex: number;
  onDotPress?: (index: number) => void;
  className?: string;
  /** Accessibility label prefix, e.g. "Go to slide" */
  labelPrefix?: string;
}

/** Shared pagination dots for home carousels. */
export function CarouselDots({
  count,
  activeIndex,
  onDotPress,
  className,
  labelPrefix = "Go to slide",
}: ICarouselDotsProps) {
  if (count < 2) return null;

  return (
    <View
      className={cn(
        "mt-4 flex-row items-center justify-center gap-2",
        className,
      )}
    >
      {Array.from({ length: count }, (_, index) => (
        <Pressable
          key={index}
          accessibilityRole="button"
          accessibilityLabel={`${labelPrefix} ${index + 1}`}
          accessibilityState={{ selected: index === activeIndex }}
          hitSlop={10}
          disabled={!onDotPress}
          onPress={() => onDotPress?.(index)}
          className={cn(
            "h-2 rounded-full",
            index === activeIndex ? "w-5 bg-primary" : "w-2 bg-cream/35",
          )}
        />
      ))}
    </View>
  );
}
