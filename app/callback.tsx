import { useAuth } from "@clerk/expo";
import { Redirect, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { palette } from "@/constants/Colors";

WebBrowser.maybeCompleteAuthSession();

/**
 * OAuth return route for Google SSO (`…://callback` / Expo Go `…/--/callback`).
 * Completes the browser session and sends the user into the app.
 */
export default function OAuthCallbackScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const timer = setTimeout(() => {
      router.replace(isSignedIn ? "/(tabs)" : "/");
    }, 50);

    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn, router]);

  if (isLoaded && isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator color={palette.primary} />
    </View>
  );
}
