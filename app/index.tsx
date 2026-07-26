import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

import { BootstrapSkeleton } from "@/components/ui";
import { isClerkConfigured } from "@/features/auth/auth.config";
import { useRequireAuth } from "@/features/auth/useRequireAuth.hook";
import { useAppStore } from "@/stores/useAppStore";

/** Avoid hanging forever if Clerk production Frontend API is unreachable. */
const CLERK_LOAD_TIMEOUT_MS = 12_000;

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
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      return;
    }
    const timer = setTimeout(() => {
      setHasTimedOut(true);
      if (__DEV__) {
        console.warn(
          "[auth] Clerk isLoaded timed out — check pk_live key + Clerk Frontend API DNS (e.g. clerk.argorsi.com).",
        );
      }
    }, CLERK_LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  if (!isLoaded && !hasTimedOut) {
    return (
      <View className="flex-1 bg-background">
        <BootstrapSkeleton />
      </View>
    );
  }

  // Signed-in users skip onboarding if they somehow land here again.
  if (isLoaded && isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  if (!hasOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
