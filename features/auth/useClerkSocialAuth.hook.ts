import { useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

import { getClerkErrorMessage } from "@/features/auth/auth.utils";

WebBrowser.maybeCompleteAuthSession();

/**
 * Must match `scheme` in app.config.js.
 * Allowlist in Clerk → Native applications → Allowlist for mobile SSO redirect
 * (Clerk default pattern is `{scheme}://callback`).
 */
const SSO_REDIRECT_URL = AuthSession.makeRedirectUri({
  scheme: "jevan-hana",
  path: "callback",
});

export function useClerkSocialAuth() {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const continueWithGoogle = useCallback(async () => {
    setIsGoogleLoading(true);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: SSO_REDIRECT_URL,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (error) {
      const message = getClerkErrorMessage(error);
      console.warn("[auth] Google SSO failed", {
        message,
        redirectUrl: SSO_REDIRECT_URL,
        error,
      });
      Alert.alert(
        "Google Sign-In Failed",
        message.toLowerCase().includes("redirect")
          ? `${message}\n\nAdd this URL in Clerk → Native applications → Allowlist for mobile SSO redirect:\n${SSO_REDIRECT_URL}`
          : message,
      );
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
