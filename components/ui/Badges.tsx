import { SymbolView } from "expo-symbols";
import { View } from "react-native";

import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";

const FEATURED_ICON = {
  ios: "checkmark.seal.fill",
  android: "verified_user",
  web: "verified_user",
} as const;

/**
 * Featured listing — verified icon beside the name (not a text pill).
 * Admin-curated flag only — not a separate listing module.
 */
export function FeaturedIcon({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <View className={cn("shrink-0", className)}>
      <SymbolView
        name={FEATURED_ICON}
        size={size}
        tintColor={palette.primary}
        accessibilityLabel="Featured"
      />
    </View>
  );
}
