import { Stack } from "expo-router";

import { palette } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";

export default function EventsStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: palette.background },
        headerTintColor: palette.cream,
        headerTitleStyle: { fontFamily: fonts.english.semibold },
        contentStyle: { backgroundColor: palette.background },
      }}
    >
      <Stack.Screen name="[id]" options={{ title: "Event" }} />
    </Stack>
  );
}
