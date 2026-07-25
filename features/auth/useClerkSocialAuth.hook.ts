import { useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

import { getClerkErrorMessage } from "@/features/auth/auth.utils";
import { useAppStore } from "@/stores/useAppStore";

WebBrowser.maybeCompleteAuthSession();

/**
 * Must match `scheme` in app.config.js and Clerk → Native applications
 * → Allowlist for mobile SSO redirect (`jevan-hana://callback`).
 */
const SSO_REDIRECT_URL = AuthSession.makeRedirectUri({
  scheme: "jevan-hana",
  path: "callback",
});

function buildUsernameFromEmail(email: string | null | undefined): string {
  const local = (email ?? "user")
    .split("@")[0]
    ?.toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 12);
  const suffix = String(Math.floor(1000 + Math.random() * 9000));
  return `${local || "user"}${suffix}`;
}

export function useClerkSocialAuth() {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const setHasOnboarded = useAppStore((state) => state.setHasOnboarded);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  const continueWithGoogle = useCallback(async () => {
    setIsGoogleLoading(true);

    try {
      const { createdSessionId, setActive, signIn, signUp, authSessionResult } =
        await startSSOFlow({
          strategy: "oauth_google",
          redirectUrl: SSO_REDIRECT_URL,
        });

      if (
        authSessionResult?.type === "cancel" ||
        authSessionResult?.type === "dismiss"
      ) {
        return;
      }

      let sessionId = createdSessionId;

      // Google OAuth often leaves sign-up incomplete when Clerk requires username.
      if (
        !sessionId &&
        signUp &&
        signUp.status === "missing_requirements" &&
        (signUp.missingFields ?? []).includes("username")
      ) {
        await signUp.update({
          username: buildUsernameFromEmail(signUp.emailAddress),
        });
        sessionId = signUp.createdSessionId;
      }

      if (!sessionId) {
        sessionId =
          signUp?.createdSessionId ?? signIn?.createdSessionId ?? null;
      }

      if (sessionId && setActive) {
        await setActive({ session: sessionId });
        setHasOnboarded(true);
        router.replace("/(tabs)");
        return;
      }

      const missing =
        signUp?.missingFields?.length ?
          ` Missing: ${signUp.missingFields.join(", ")}.`
        : "";
      Alert.alert(
        "Google Sign-In Incomplete",
        `Google connected, but Clerk did not create a session.${missing} In Clerk Dashboard → User & authentication → Email / Username, set Username to optional (or off).`,
      );
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
          ? `${message}\n\nAllowlist in Clerk → Native applications:\n${SSO_REDIRECT_URL}`
          : message,
      );
    } finally {
      setIsGoogleLoading(false);
    }
  }, [router, setHasOnboarded, startSSOFlow]);

  return {
    continueWithGoogle,
    isGoogleLoading,
    isLoading: isGoogleLoading,
  };
}
