import { useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { TextField } from "@/components/ui/TextField";
import { palette } from "@/constants/Colors";
import { isClerkConfigured } from "@/features/auth/auth.config";
import { notifyClerkMissing } from "@/features/auth/auth.utils";
import { AuthFooterLink } from "@/features/auth/components/AuthFooterLink";
import { AuthFormHeader } from "@/features/auth/components/AuthFormHeader";
import { AuthScreenShell } from "@/features/auth/components/AuthScreenShell";
import { useClerkForgotPassword } from "@/features/auth/useClerkForgotPassword.hook";

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

function ForgotPasswordForm({ initialEmail }: { initialEmail: string }) {
  const {
    step,
    email,
    setEmail,
    isBusy,
    sendResetCode,
    verifyResetCode,
    submitNewPassword,
    resendResetCode,
    restart,
    getFieldError,
  } = useClerkForgotPassword(initialEmail);

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View className="gap-6">
      {step === "email" ? (
        <>
          <AuthFormHeader
            title="Forgot Password"
            subtitle="Enter your email and we’ll send a reset code."
          />

          <View className="gap-4">
            <TextField
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
            />
            {getFieldError("identifier") ? (
              <Text variant="caption" tone="primary">
                {getFieldError("identifier")}
              </Text>
            ) : null}
          </View>

          <Button
            variant="primary"
            size="lg"
            isFullWidth
            isLoading={isBusy}
            isDisabled={!email.trim() || isBusy}
            onPress={() => void sendResetCode()}
          >
            Send Reset Code
          </Button>
        </>
      ) : null}

      {step === "code" ? (
        <>
          <AuthFormHeader
            title="Enter Reset Code"
            subtitle={`We sent a code to ${email.trim() || "your email"}.`}
          />

          <View className="gap-4">
            <TextField
              label="Reset Code"
              value={code}
              onChangeText={setCode}
              placeholder="Enter the code from your email"
              keyboardType="number-pad"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="oneTimeCode"
            />
            {getFieldError("code") ? (
              <Text variant="caption" tone="primary">
                {getFieldError("code")}
              </Text>
            ) : null}
          </View>

          <View className="gap-3">
            <Button
              variant="primary"
              size="lg"
              isFullWidth
              isLoading={isBusy}
              isDisabled={!code.trim() || isBusy}
              onPress={() => void verifyResetCode(code)}
            >
              Verify Code
            </Button>

            <Pressable
              accessibilityRole="button"
              onPress={() => void resendResetCode()}
              disabled={isBusy}
              className="items-center py-2"
            >
              <Text variant="body" tone="primary" weight="semibold">
                Resend Code
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => {
                restart();
                setCode("");
                setPassword("");
                setConfirmPassword("");
              }}
              className="items-center py-2"
            >
              <Text variant="body" tone="muted" weight="semibold">
                Use a Different Email
              </Text>
            </Pressable>
          </View>
        </>
      ) : null}

      {step === "password" ? (
        <>
          <AuthFormHeader
            title="Set New Password"
            subtitle="Choose a new password for your account."
          />

          <View className="gap-4">
            <TextField
              label="New Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter a new password"
              secureTextEntry={!isPasswordVisible}
              textContentType="newPassword"
              rightSlot={
                <SymbolView
                  name={{
                    ios: isPasswordVisible ? "eye.slash" : "eye",
                    android: isPasswordVisible ? "visibility_off" : "visibility",
                    web: isPasswordVisible ? "visibility_off" : "visibility",
                  }}
                  tintColor={palette.cream}
                  size={20}
                />
              }
              onRightPress={() => setIsPasswordVisible((value) => !value)}
            />
            {getFieldError("password") ? (
              <Text variant="caption" tone="primary">
                {getFieldError("password")}
              </Text>
            ) : null}

            <TextField
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter your new password"
              secureTextEntry={!isPasswordVisible}
              textContentType="newPassword"
            />
          </View>

          <Button
            variant="primary"
            size="lg"
            isFullWidth
            isLoading={isBusy}
            isDisabled={!password || !confirmPassword || isBusy}
            onPress={() => void submitNewPassword(password, confirmPassword)}
          >
            Update Password
          </Button>
        </>
      ) : null}

      <AuthFooterLink
        prompt="Remember your password?"
        linkLabel="Log In"
        href="/login"
      />
    </View>
  );
}

export function ForgotPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string | string[] }>();
  const initialEmail = firstParam(params.email);

  return (
    <AuthScreenShell>
      {isClerkConfigured ? (
        <ForgotPasswordForm initialEmail={initialEmail} />
      ) : (
        <View className="gap-6">
          <AuthFormHeader
            title="Forgot Password"
            subtitle="Clerk is not configured in this build."
          />
          <Button
            variant="primary"
            size="lg"
            isFullWidth
            onPress={notifyClerkMissing}
          >
            Send Reset Code
          </Button>
          <AuthFooterLink
            prompt="Remember your password?"
            linkLabel="Log In"
            href="/login"
          />
        </View>
      )}
    </AuthScreenShell>
  );
}
