import { Stack } from "expo-router";
import { View } from "react-native";

import { StackBackButton } from "@/components/ui/StackBackButton";
import { palette } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";

export default function ProfileStackLayout() {
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
          <Stack.Screen name="edit" options={{ title: "Edit profile" }} />
          <Stack.Screen name="posts" options={{ title: "My posts" }} />
          <Stack.Screen name="saved" options={{ title: "Saved places" }} />
          <Stack.Screen name="going" options={{ title: "Events going" }} />
      </Stack>
    </View>
  );
}
