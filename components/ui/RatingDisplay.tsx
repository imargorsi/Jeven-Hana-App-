import { SymbolView } from "expo-symbols";
import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";

interface IRatingDisplayProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
}

export function RatingDisplay({
  rating,
  reviewCount,
  size = "sm",
  className,
}: IRatingDisplayProps) {
  return (
    <View className={cn("flex-row items-center gap-1", className)}>
      <SymbolView
        name={{ ios: "star.fill", android: "star", web: "star" }}
        size={size === "sm" ? 12 : 16}
        tintColor={palette.primary}
      />
      <Text variant={size === "sm" ? "caption" : "bodySmall"} weight="semibold">
        {rating.toFixed(1)}
      </Text>
      {typeof reviewCount === "number" ? (
        <Text variant="caption" tone="muted">
          ({reviewCount})
        </Text>
      ) : null}
    </View>
  );
}
