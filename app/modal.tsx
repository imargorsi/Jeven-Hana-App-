import { StatusBar } from "expo-status-bar";
import { Platform, View } from "react-native";

import { Screen, Text } from "@/components/ui";

export default function ModalScreen() {
  return (
    <Screen withSafeArea={false}>
      <View className="flex-1 items-center justify-center px-5">
        <Text variant="h2">Modal</Text>
        <Text variant="body" tone="muted" className="mt-2 text-center">
          Shared theme components work here too.
        </Text>
      </View>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </Screen>
  );
}
