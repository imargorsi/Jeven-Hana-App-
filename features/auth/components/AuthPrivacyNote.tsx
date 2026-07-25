import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { href } from "@/lib/navigation.utils";

export function AuthPrivacyNote() {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-center gap-2 px-4">
      <SymbolView
        name={{
          ios: "checkmark.shield",
          android: "verified_user",
          web: "verified_user",
        }}
        tintColor={palette.primary}
        size={16}
      />
      <Text variant="caption" tone="muted" className="flex-shrink text-center">
        Your data is safe with us. We respect your{" "}
        <Text
          variant="caption"
          tone="primary"
          accessibilityRole="link"
          onPress={() => router.push(href("/privacy"))}
        >
          privacy
        </Text>
        .
      </Text>
    </View>
  );
}
