import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { palette } from "@/constants/Colors";
import { isClerkConfigured } from "@/features/auth/auth.config";
import { useRequireAuth } from "@/features/auth/useRequireAuth.hook";
import { useAppStore } from "@/stores/useAppStore";

/**
 * Entry: onboarding once → home tabs for everyone.
 * Sign-in is only required when a guest tries an account action.
 */
export default function Index() {
  const hasOnboarded = useAppStore((state) => state.hasOnboarded);

  if (isClerkConfigured) {
    return <ClerkAwareIndex hasOnboarded={hasOnboarded} />;
  }

  if (!hasOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}

function ClerkAwareIndex({ hasOnboarded }: { hasOnboarded: boolean }) {
  const { isSignedIn, isLoaded } = useRequireAuth();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={palette.primary} />
      </View>
    );
  }

  // Signed-in users skip onboarding if they somehow land here again.
  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  if (!hasOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
