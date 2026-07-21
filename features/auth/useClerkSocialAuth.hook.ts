import { useSSO } from "@clerk/expo";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

import { getClerkErrorMessage } from "@/features/auth/auth.utils";

WebBrowser.maybeCompleteAuthSession();

type TSocialStrategy = "oauth_google" | "oauth_facebook";

export function useClerkSocialAuth() {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [loadingStrategy, setLoadingStrategy] = useState<TSocialStrategy | null>(
    null,
  );

  const continueWithProvider = useCallback(
    async (strategy: TSocialStrategy) => {
      setLoadingStrategy(strategy);

      try {
        const { createdSessionId, setActive } = await startSSOFlow({
          strategy,
          redirectUrl: Linking.createURL("/"),
        });

        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
          router.replace("/(tabs)");
        }
      } catch (error) {
        const provider = strategy === "oauth_google" ? "Google" : "Facebook";
        Alert.alert(`${provider} sign-in failed`, getClerkErrorMessage(error));
      } finally {
        setLoadingStrategy(null);
      }
    },
    [router, startSSOFlow],
  );

  return {
    continueWithGoogle: () => continueWithProvider("oauth_google"),
    continueWithFacebook: () => continueWithProvider("oauth_facebook"),
    isGoogleLoading: loadingStrategy === "oauth_google",
    isFacebookLoading: loadingStrategy === "oauth_facebook",
    isLoading: loadingStrategy !== null,
  };
}
