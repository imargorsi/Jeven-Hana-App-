import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import type { ReactNode } from "react";
import { View } from "react-native";

import { BootstrapSkeleton } from "@/components/ui";
import { palette } from "@/constants/Colors";
import { isClerkConfigured } from "@/features/auth/auth.config";

function ClerkAuthGuard({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View className="flex-1 bg-background">
        <BootstrapSkeleton />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return children;
}

export default function AuthLayout() {
  const stack = (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: palette.background },
        animation: "slide_from_right",
      }}
    />
  );

  if (!isClerkConfigured) {
    return stack;
  }

  return <ClerkAuthGuard>{stack}</ClerkAuthGuard>;
}
