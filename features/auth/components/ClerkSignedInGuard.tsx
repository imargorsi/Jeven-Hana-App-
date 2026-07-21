import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { palette } from "@/constants/Colors";

interface IClerkSignedInGuardProps {
  children: React.ReactNode;
  redirectHref?: "/login" | "/onboarding";
}

export function ClerkSignedInGuard({
  children,
  redirectHref = "/login",
}: IClerkSignedInGuardProps) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={palette.primary} />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href={redirectHref} />;
  }

  return children;
}
