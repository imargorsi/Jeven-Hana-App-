import { Stack } from "expo-router";
import { View } from "react-native";

import { StackBackButton } from "@/components/ui/StackBackButton";
import { palette } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";
import { isClerkConfigured } from "@/features/auth/auth.config";
import { ClerkSignedInGuard } from "@/features/auth/components/ClerkSignedInGuard";

function ProfileStack() {
  return (
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
      <Stack.Screen name="edit" options={{ title: "Edit Profile" }} />
      <Stack.Screen name="posts" options={{ title: "My Posts" }} />
      <Stack.Screen name="saved" options={{ title: "Saved Places" }} />
      <Stack.Screen name="going" options={{ title: "Events Going" }} />
    </Stack>
  );
}

export default function ProfileStackLayout() {
  if (!isClerkConfigured) {
    return (
      <View className="flex-1 bg-background">
        <ProfileStack />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ClerkSignedInGuard redirectHref="/register">
        <ProfileStack />
      </ClerkSignedInGuard>
    </View>
  );
}
