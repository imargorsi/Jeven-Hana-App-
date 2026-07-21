import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/ui/AppHeader";
import { stackChromeScreenOptions } from "@/components/ui/StackChromeLayout";

export default function CommunityStackLayout() {
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top"]} className="bg-background">
        <View className="px-4">
          <AppHeader />
        </View>
      </SafeAreaView>
      <Stack screenOptions={stackChromeScreenOptions}>
        <Stack.Screen
          name="create"
          options={{ title: "Create post", presentation: "modal" }}
        />
        <Stack.Screen name="[id]" options={{ title: "Post" }} />
      </Stack>
    </View>
  );
}
