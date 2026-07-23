import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn.utils";

/**
 * Curated Jevan Hana Ka Best badge — solid primary gold, clean & modern.
 * Badge only — not a separate listing module.
 */
export function KaBestBadge({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const isSmall = size === "sm";

  return (
    <View
      className={cn(
        "self-start rounded-chip bg-primary",
        isSmall ? "px-2 py-0.5" : "px-2.5 py-1",
        className,
      )}
    >
      <Text
        variant="caption"
        tone="background"
        weight="bold"
        numberOfLines={1}
        style={isSmall ? { fontSize: 10, lineHeight: 14 } : undefined}
      >
        {isSmall ? "Ka Best" : "Jevan Hana Ka Best"}
      </Text>
    </View>
  );
}
