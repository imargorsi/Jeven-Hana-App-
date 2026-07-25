import { useSSO } from "@clerk/expo";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

import { getClerkErrorMessage } from "@/features/auth/auth.utils";

WebBrowser.maybeCompleteAuthSession();

export function useClerkSocialAuth() {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const continueWithGoogle = useCallback(async () => {
    setIsGoogleLoading(true);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: Linking.createURL("/"),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (error) {
      Alert.alert("Google Sign-In Failed", getClerkErrorMessage(error));
    } finally {
      setIsGoogleLoading(false);
    }
  }, [router, startSSOFlow]);

  return {
    continueWithGoogle,
    isGoogleLoading,
    isLoading: isGoogleLoading,
  };
}
