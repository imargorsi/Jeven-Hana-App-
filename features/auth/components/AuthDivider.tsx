import { View } from "react-native";

import { Text } from "@/components/ui/Text";

export function AuthDivider() {
  return (
    <View className="w-full flex-row items-center gap-3">
      <View className="h-px flex-1 bg-cream/15" />
      <Text variant="caption" tone="muted">
        or
      </Text>
      <View className="h-px flex-1 bg-cream/15" />
    </View>
  );
}
