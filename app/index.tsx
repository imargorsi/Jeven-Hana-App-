import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { palette } from "@/constants/Colors";
import { isClerkConfigured } from "@/features/auth/auth.config";
import { useAppStore } from "@/stores/useAppStore";

function ClerkIndexRedirect() {
  const { isSignedIn, isLoaded } = useAuth();
  const hasOnboarded = useAppStore((state) => state.hasOnboarded);

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={palette.primary} />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  if (!hasOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/login" />;
}

export default function Index() {
  const hasOnboarded = useAppStore((state) => state.hasOnboarded);

  if (isClerkConfigured) {
    return <ClerkIndexRedirect />;
  }

  if (!hasOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/login" />;
}
