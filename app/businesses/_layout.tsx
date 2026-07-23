import { Stack } from "expo-router";
import { View } from "react-native";

import { stackChromeScreenOptions } from "@/components/ui/StackChromeLayout";

/**
 * Business stack — immersive detail (full-bleed hero).
 * Listing hub lives on the Explore tab.
 */
export default function BusinessesLayout() {
  return (
    <View className="flex-1 bg-background">
      <Stack screenOptions={stackChromeScreenOptions}>
        <Stack.Screen name="index" options={{ title: "Businesses" }} />
        <Stack.Screen name="category/[slug]" options={{ title: "Category" }} />
        <Stack.Screen
          name="[id]"
          options={{ headerShown: false, title: "Business" }}
        />
      </Stack>
    </View>
  );
}
