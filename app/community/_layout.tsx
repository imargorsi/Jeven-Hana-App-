import { Stack } from "expo-router";

import { palette } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";

export default function CommunityStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: palette.background },
        headerTintColor: palette.cream,
        headerTitleStyle: { fontFamily: fonts.english.semibold },
        contentStyle: { backgroundColor: palette.background },
      }}
    >
      <Stack.Screen name="create" options={{ title: "Create post", presentation: "modal" }} />
      <Stack.Screen name="[id]" options={{ title: "Post" }} />
    </Stack>
  );
}
