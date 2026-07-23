import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn.utils";

export function PinnedBadge({ className }: { className?: string }) {
  return (
    <View
      className={cn(
        "rounded-chip border border-primary/40 bg-primary/15 px-2 py-0.5",
        className,
      )}
    >
      <Text variant="caption" tone="primary" weight="semibold">
        Pinned
      </Text>
    </View>
  );
}

export function AdminBadge({ className }: { className?: string }) {
  return (
    <View
      className={cn(
        "rounded-chip border border-cream/20 bg-cream/10 px-2 py-0.5",
        className,
      )}
    >
      <Text variant="caption" weight="semibold">
        Admin
      </Text>
    </View>
  );
}

export function RankBadge({
  rank,
  className,
}: {
  rank: number;
  className?: string;
}) {
  return (
    <View
      className={cn(
        "h-8 w-8 items-center justify-center rounded-full bg-primary",
        className,
      )}
    >
      <Text variant="caption" tone="background" weight="bold">
        #{rank}
      </Text>
    </View>
  );
}

/**
 * Curated Jevan Hana Ka Best badge — solid primary gold, clean & modern.
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
