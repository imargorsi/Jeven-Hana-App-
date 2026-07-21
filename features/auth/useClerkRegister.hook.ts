import { useSignUp } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";

import type { IRegisterFormValues } from "@/features/auth/auth.types";
import {
  getClerkErrorMessage,
  getClerkFieldError,
} from "@/features/auth/auth.utils";
import { createClerkFinalizeNavigate } from "@/features/auth/clerk.navigation";

export function useClerkRegister() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);

  const needsEmailVerification = useMemo(() => {
    if (!signUp) {
      return false;
    }

    return (
      signUp.status === "missing_requirements" &&
      signUp.unverifiedFields.includes("email_address") &&
      signUp.missingFields.length === 0
    );
  }, [signUp]);

  const register = useCallback(
    async ({ username, email, password }: IRegisterFormValues) => {
      const trimmedUsername = username.trim();
      const trimmedEmail = email.trim();

      if (!trimmedUsername || !trimmedEmail || !password) {
        Alert.alert("Missing details", "Please fill in all fields.");
        return;
      }

      if (!signUp) {
        return;
      }

      try {
        const { error } = await signUp.password({
          emailAddress: trimmedEmail,
          password,
        });

        if (error) {
          Alert.alert("Registration failed", getClerkErrorMessage(error));
          return;
        }

        await signUp.update({
          username: trimmedUsername,
        });

        if (signUp.status === "complete") {
          await signUp.finalize({
            navigate: createClerkFinalizeNavigate(router),
          });
          return;
        }

        await signUp.verifications.sendEmailCode();
      } catch (error) {
        Alert.alert("Registration failed", getClerkErrorMessage(error));
      }
    },
    [router, signUp],
  );

  const verifyEmailCode = useCallback(
    async (code: string) => {
      if (!signUp || !code.trim()) {
        Alert.alert("Missing code", "Enter the verification code from your email.");
        return;
      }

      setIsVerifying(true);

      try {
        await signUp.verifications.verifyEmailCode({ code: code.trim() });

        if (signUp.status === "complete") {
          await signUp.finalize({
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
    [router, signUp],
  );

  const resendEmailCode = useCallback(async () => {
    if (!signUp) {
      return;
    }

    try {
      await signUp.verifications.sendEmailCode();
      Alert.alert("Code sent", "Check your email for a new verification code.");
    } catch (error) {
      Alert.alert("Could not resend code", getClerkErrorMessage(error));
    }
  }, [signUp]);

  return {
    register,
    verifyEmailCode,
    resendEmailCode,
    needsEmailVerification,
    isSubmitting: fetchStatus === "fetching",
    isVerifying,
    getFieldError: (field: string) => getClerkFieldError(errors, field),
  };
}
