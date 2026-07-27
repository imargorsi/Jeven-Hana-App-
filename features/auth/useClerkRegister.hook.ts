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
import { splitFullName } from "@/features/auth/fullName.utils";

function isAwaitingEmailVerification(
  signUp: ReturnType<typeof useSignUp>["signUp"],
): boolean {
  if (!signUp) {
    return false;
  }

  return (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  );
}

export function useClerkRegister() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  // Force the verify step the moment our own code confirms the email code
  // was sent — don't rely solely on Clerk's store re-rendering this
  // component after sendEmailCode() resolves, since that re-render was
  // sometimes missed, leaving the user stuck on the form screen despite the
  // code already being sent.
  const [forceVerifyStep, setForceVerifyStep] = useState(false);

  const needsEmailVerification = useMemo(
    () => forceVerifyStep || isAwaitingEmailVerification(signUp),
    [forceVerifyStep, signUp],
  );

  const register = useCallback(
    async ({ fullName, username, email, password }: IRegisterFormValues) => {
      const trimmedName = fullName.trim();
      const trimmedUsername = username.trim();
      const trimmedEmail = email.trim();

      if (!trimmedName || !trimmedUsername || !trimmedEmail || !password) {
        Alert.alert("Missing Details", "Please fill in all fields.");
        return;
      }

      if (!signUp) {
        return;
      }

      const { firstName, lastName } = splitFullName(trimmedName);

      try {
        const { error } = await signUp.password({
          emailAddress: trimmedEmail,
          password,
          firstName,
          lastName: lastName || undefined,
        });

        if (error) {
          Alert.alert("Registration Failed", getClerkErrorMessage(error));
          return;
        }

        await signUp.update({
          username: trimmedUsername,
          firstName,
          lastName: lastName || undefined,
        });

        if (signUp.status === "complete") {
          await signUp.finalize({
            navigate: createClerkFinalizeNavigate(router),
          });
          return;
        }

        const { error: sendCodeError } = await signUp.verifications.sendEmailCode();

        if (sendCodeError) {
          Alert.alert("Registration Failed", getClerkErrorMessage(sendCodeError));
          return;
        }

        setForceVerifyStep(true);
      } catch (error) {
        Alert.alert("Registration Failed", getClerkErrorMessage(error));
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
