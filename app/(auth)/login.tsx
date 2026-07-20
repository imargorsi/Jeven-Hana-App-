import { View } from "react-native";

import { Screen, Text } from "@/components/ui";

export default function LoginScreen() {
  return (
    <Screen className="items-center justify-center">
      <View className="items-center px-6">
        <Text variant="h1" tone="cream" weight="bold">
          login
        </Text>
      </View>
    </Screen>
  );
}
