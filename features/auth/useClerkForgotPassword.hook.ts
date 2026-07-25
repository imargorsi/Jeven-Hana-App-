import { useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

import {
  getClerkErrorMessage,
  getClerkFieldError,
} from "@/features/auth/auth.utils";
import { createClerkFinalizeNavigate } from "@/features/auth/clerk.navigation";
import { useAppStore } from "@/stores/useAppStore";

export type TForgotPasswordStep = "email" | "code" | "password";

export function useClerkForgotPassword(initialEmail = "") {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const setHasOnboarded = useAppStore((state) => state.setHasOnboarded);
  const [step, setStep] = useState<TForgotPasswordStep>("email");
  const [email, setEmail] = useState(initialEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBusy = isSubmitting || fetchStatus === "fetching";

  // Login + forgot password share Clerk's SignIn resource — start clean.
  useEffect(() => {
    signIn?.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on mount
  }, []);

  const sendResetCode = useCallback(async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert("Missing Email", "Enter the email for your account.");
      return;
    }

    if (!signIn) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: createError } = await signIn.create({
        identifier: trimmedEmail,
      });

      if (createError) {
        Alert.alert("Could Not Start Reset", getClerkErrorMessage(createError));
        return;
      }

      const { error: sendError } =
        await signIn.resetPasswordEmailCode.sendCode();

      if (sendError) {
        Alert.alert("Could Not Send Code", getClerkErrorMessage(sendError));
        return;
      }

      setStep("code");
    } catch (error) {
      Alert.alert("Could Not Send Code", getClerkErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }, [email, signIn]);

  const verifyResetCode = useCallback(
    async (code: string) => {
      if (!signIn || !code.trim()) {
        Alert.alert("Missing Code", "Enter the code from your email.");
        return;
      }

      setIsSubmitting(true);

      try {
        const { error } = await signIn.resetPasswordEmailCode.verifyCode({
          code: code.trim(),
        });

        if (error) {
          Alert.alert("Invalid Code", getClerkErrorMessage(error));
          return;
        }

        if (signIn.status === "needs_new_password") {
          setStep("password");
          return;
        }

        // Rare: code accepted and session already complete.
        if (signIn.status === "complete") {
          setHasOnboarded(true);
          await signIn.finalize({
            navigate: createClerkFinalizeNavigate(router),
          });
          return;
        }

        Alert.alert(
          "Verification Incomplete",
          "Check the code and try again, or request a new one.",
        );
      } catch (error) {
        Alert.alert("Verification Failed", getClerkErrorMessage(error));
      } finally {
        setIsSubmitting(false);
      }
    },
    [router, setHasOnboarded, signIn],
  );

  const submitNewPassword = useCallback(
    async (password: string, confirmPassword: string) => {
      if (!signIn) {
        return;
      }

      if (!password || password.length < 8) {
        Alert.alert(
          "Weak Password",
          "Use at least 8 characters for your new password.",
        );
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Passwords Do Not Match", "Re-enter the same password.");
        return;
      }

      setIsSubmitting(true);

      try {
        const { error } = await signIn.resetPasswordEmailCode.submitPassword({
          password,
          signOutOfOtherSessions: true,
        });

        if (error) {
          Alert.alert("Could Not Reset Password", getClerkErrorMessage(error));
          return;
        }

        if (signIn.status === "complete") {
          setHasOnboarded(true);
          await signIn.finalize({
            navigate: createClerkFinalizeNavigate(router),
          });
          return;
        }

        Alert.alert(
          "Almost Done",
          "Password updated, but sign-in needs another step. Try logging in with your new password.",
        );
        signIn.reset();
        router.replace("/login");
      } catch (error) {
        Alert.alert("Could Not Reset Password", getClerkErrorMessage(error));
      } finally {
        setIsSubmitting(false);
      }
    },
    [router, setHasOnboarded, signIn],
  );

  const resendResetCode = useCallback(async () => {
    if (!signIn) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signIn.resetPasswordEmailCode.sendCode();

      if (error) {
        Alert.alert("Could Not Resend Code", getClerkErrorMessage(error));
        return;
      }

      Alert.alert("Code Sent", "Check your email for a new password reset code.");
    } catch (error) {
      Alert.alert("Could Not Resend Code", getClerkErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }, [signIn]);

  const restart = useCallback(() => {
    signIn?.reset();
    setStep("email");
  }, [signIn]);

  return {
    step,
    email,
    setEmail,
    isBusy,
    sendResetCode,
    verifyResetCode,
    submitNewPassword,
    resendResetCode,
    restart,
    getFieldError: (field: string) => getClerkFieldError(errors, field),
  };
}
