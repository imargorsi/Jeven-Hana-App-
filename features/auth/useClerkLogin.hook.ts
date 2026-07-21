import { useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";

import type { ILoginFormValues } from "@/features/auth/auth.types";
import {
  getClerkErrorMessage,
  getClerkFieldError,
} from "@/features/auth/auth.utils";
import { createClerkFinalizeNavigate } from "@/features/auth/clerk.navigation";

export function useClerkLogin() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);

  const needsEmailVerification = useMemo(
    () => signIn?.status === "needs_client_trust",
    [signIn?.status],
  );

  const login = useCallback(
    async ({ email, password }: ILoginFormValues) => {
      const trimmedEmail = email.trim();

      if (!trimmedEmail || !password) {
        Alert.alert("Missing details", "Enter your email and password.");
        return;
      }

      if (!signIn) {
        return;
      }

      try {
        const { error } = await signIn.password({
          identifier: trimmedEmail,
          password,
        });

        if (error) {
          Alert.alert("Login failed", getClerkErrorMessage(error));
          return;
        }

        if (signIn.status === "complete") {
          await signIn.finalize({
            navigate: createClerkFinalizeNavigate(router),
          });
          return;
        }

        if (signIn.status === "needs_client_trust") {
          const emailCodeFactor = signIn.supportedSecondFactors?.find(
            (factor) => factor.strategy === "email_code",
          );

          if (emailCodeFactor) {
            await signIn.mfa.sendEmailCode();
          }

          return;
        }

        Alert.alert(
          "Additional verification needed",
          "Complete verification in your Clerk dashboard settings, then try again.",
        );
      } catch (error) {
        Alert.alert("Login failed", getClerkErrorMessage(error));
      }
    },
    [router, signIn],
  );

  const verifyEmailCode = useCallback(
    async (code: string) => {
      if (!signIn || !code.trim()) {
        Alert.alert("Missing code", "Enter the verification code from your email.");
        return;
      }

      setIsVerifying(true);

      try {
        await signIn.mfa.verifyEmailCode({ code: code.trim() });

        if (signIn.status === "complete") {
          await signIn.finalize({
            navigate: createClerkFinalizeNavigate(router),
          });
          return;
        }

        Alert.alert(
          "Verification incomplete",
          "Check the code and try again, or request a new one.",
        );
      } catch (error) {
        Alert.alert("Verification failed", getClerkErrorMessage(error));
      } finally {
        setIsVerifying(false);
      }
    },
    [router, signIn],
  );

  const resendEmailCode = useCallback(async () => {
    if (!signIn) {
      return;
    }

    try {
      await signIn.mfa.sendEmailCode();
      Alert.alert("Code sent", "Check your email for a new verification code.");
    } catch (error) {
      Alert.alert("Could not resend code", getClerkErrorMessage(error));
    }
  }, [signIn]);

  const resetSignIn = useCallback(() => {
    signIn?.reset();
  }, [signIn]);

  return {
    login,
    verifyEmailCode,
    resendEmailCode,
    resetSignIn,
    needsEmailVerification,
    isSubmitting: fetchStatus === "fetching",
    isVerifying,
    getFieldError: (field: string) => getClerkFieldError(errors, field),
  };
}
