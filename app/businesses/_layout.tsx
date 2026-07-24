import { Stack } from "expo-router";
import { View } from "react-native";

import { StackBackButton } from "@/components/ui/StackBackButton";
import { palette } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";

/**
 * Business stack — public browse/detail; create/edit use screen-level auth guards.
 * Listing hub lives on the Explore tab.
 */
export default function BusinessesLayout() {
  return (
    <View className="flex-1 bg-background">
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: palette.background },
          headerTintColor: palette.cream,
          headerTitleStyle: {
            fontFamily: fonts.english.semibold,
            fontSize: 17,
          },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => <StackBackButton />,
          headerTitleAlign: "left",
          contentStyle: { backgroundColor: palette.background },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Businesses" }} />
        <Stack.Screen name="category/[slug]" options={{ title: "Category" }} />
        <Stack.Screen
          name="[id]/index"
          options={{ headerShown: false, title: "Business" }}
        />
        <Stack.Screen name="create" options={{ title: "Create listing" }} />
        <Stack.Screen name="[id]/edit" options={{ title: "Edit listing" }} />
      </Stack>
    </View>
  );
}
