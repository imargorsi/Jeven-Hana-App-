import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import type { ReactNode } from "react";
import { View } from "react-native";

import { BootstrapSkeleton } from "@/components/ui";

interface IClerkSignedInGuardProps {
  children: ReactNode;
  redirectHref?: "/login" | "/register" | "/onboarding";
}

export function ClerkSignedInGuard({
  children,
  redirectHref = "/register",
}: IClerkSignedInGuardProps) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View className="flex-1 bg-background">
        <BootstrapSkeleton />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href={redirectHref} />;
  }

  return children;
}
