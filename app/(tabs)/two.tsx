import { View } from "react-native";

import { Screen, Text } from "@/components/ui";

export default function ExploreScreen() {
  return (
    <Screen>
      <View className="flex-1 items-center justify-center px-5">
        <Text variant="h2">Explore</Text>
        <Text variant="body" tone="muted" className="mt-2 text-center">
          Discover places and businesses around Jevan Hana.
        </Text>
      </View>
    </Screen>
  );
}
