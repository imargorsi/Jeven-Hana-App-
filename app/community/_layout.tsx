import { Stack } from "expo-router";
import { View } from "react-native";

import { StackBackButton } from "@/components/ui/StackBackButton";
import { palette } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";
import { isClerkConfigured } from "@/features/auth/auth.config";
import { ClerkSignedInGuard } from "@/features/auth/components/ClerkSignedInGuard";

function CommunityStack() {
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
      <Stack.Screen name="create" options={{ title: "Create Post" }} />
      <Stack.Screen name="[id]/edit" options={{ title: "Edit Post" }} />
    </Stack>
  );
}

export default function CommunityStackLayout() {
  if (!isClerkConfigured) {
    return (
      <View className="flex-1 bg-background">
        <CommunityStack />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ClerkSignedInGuard redirectHref="/register">
        <CommunityStack />
      </ClerkSignedInGuard>
    </View>
  );
}
