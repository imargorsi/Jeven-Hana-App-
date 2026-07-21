import { Stack } from "expo-router";

import { palette } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";

export default function ProfileStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: palette.background },
        headerTintColor: palette.cream,
        headerTitleStyle: { fontFamily: fonts.english.semibold },
        contentStyle: { backgroundColor: palette.background },
      }}
    >
      <Stack.Screen name="edit" options={{ title: "Edit profile" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="posts" options={{ title: "My posts" }} />
    </Stack>
  );
}
