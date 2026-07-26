import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { View } from "react-native";

import { BootstrapSkeleton } from "@/components/ui";
import { href } from "@/lib/navigation.utils";

WebBrowser.maybeCompleteAuthSession();

/**
 * OAuth return route (`jevan-hana://callback`).
 * Stay on a calm skeleton until Clerk activates the session — do not bounce
 * unsigned users away immediately (that caused the Google redirect loop).
 */
export default function OAuthCallbackScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasTimedOut(true), 12_000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoaded && isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  if (hasTimedOut && isLoaded && !isSignedIn) {
    return <Redirect href={href("/login")} />;
  }

  return (
    <View className="flex-1 bg-background">
      <BootstrapSkeleton />
    </View>
  );
}
