import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { TextField } from "@/components/ui/TextField";
import { palette } from "@/constants/Colors";
import { isClerkConfigured } from "@/features/auth/auth.config";
import { notifyClerkMissing } from "@/features/auth/auth.utils";
import { AuthDivider } from "@/features/auth/components/AuthDivider";
import { AuthFooterLink } from "@/features/auth/components/AuthFooterLink";
import { AuthFormHeader } from "@/features/auth/components/AuthFormHeader";
import { AuthScreenShell } from "@/features/auth/components/AuthScreenShell";
import { LoginVerifyStep } from "@/features/auth/components/LoginVerifyStep";
import { SocialAuthButtons } from "@/features/auth/components/SocialAuthButtons";
import { useClerkLogin } from "@/features/auth/useClerkLogin.hook";
import { useClerkSocialAuth } from "@/features/auth/useClerkSocialAuth.hook";

type TLoginStep = "email" | "password";

function PreviewLoginActions() {
  return (
    <>
      <SocialAuthButtons
        onFacebookPress={notifyClerkMissing}
        onGooglePress={notifyClerkMissing}
      />
      <AuthDivider />
      <Button variant="primary" size="lg" isFullWidth onPress={notifyClerkMissing}>
        Continue
      </Button>
      <AuthFooterLink
        prompt="Don't have an account?"
        linkLabel="Sign up"
        href="/register"
      />
    </>
  );
}

function ClerkLoginForm() {
  const [step, setStep] = useState<TLoginStep>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    login,
    verifyEmailCode,
    resendEmailCode,
    resetSignIn,
    needsEmailVerification,
    isSubmitting,
    isVerifying,
    getFieldError,
  } = useClerkLogin();
  const {
    continueWithGoogle,
    continueWithFacebook,
    isGoogleLoading,
    isFacebookLoading,
    isLoading: isSocialLoading,
  } = useClerkSocialAuth();

  const isBusy = isSubmitting || isSocialLoading;

  if (needsEmailVerification) {
    return (
      <LoginVerifyStep
        verifyEmailCode={verifyEmailCode}
        resendEmailCode={resendEmailCode}
        resetSignIn={resetSignIn}
        isVerifying={isVerifying}
        getFieldError={getFieldError}
      />
    );
  }

  return (
    <View className="gap-6">
      <AuthFormHeader
        title="Sign in to Jevan Hana"
        subtitle="Welcome back! Please sign in to continue"
      />

      {step === "email" ? (
        <>
          <SocialAuthButtons
            onFacebookPress={continueWithFacebook}
            onGooglePress={continueWithGoogle}
            isDisabled={isBusy}
            isFacebookLoading={isFacebookLoading}
            isGoogleLoading={isGoogleLoading}
          />
          <AuthDivider />

          <View className="gap-4">
            <TextField
              label="Email address"
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
            isDisabled={!email.trim() || isBusy}
            onPress={() => setStep("password")}
          >
            Continue
          </Button>
        </>
      ) : (
        <>
          <View className="gap-4">
            <TextField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry={!isPasswordVisible}
              textContentType="password"
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
          </View>

          <View className="gap-3">
            <Button
              variant="primary"
              size="lg"
              isFullWidth
              isLoading={isSubmitting}
              isDisabled={!password || isBusy}
              onPress={() => login({ email, password })}
            >
              Continue
            </Button>

            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setPassword("");
                setStep("email");
              }}
              className="items-center py-2"
            >
              <Text variant="body" tone="muted" weight="semibold">
                Back
              </Text>
            </Pressable>
          </View>
        </>
      )}

      <AuthFooterLink
        prompt="Don't have an account?"
        linkLabel="Sign up"
        href="/register"
      />
    </View>
  );
}

export function LoginScreen() {
  return (
    <AuthScreenShell>
      {isClerkConfigured ? <ClerkLoginForm /> : <PreviewLoginContent />}
    </AuthScreenShell>
  );
}

function PreviewLoginContent() {
  return (
    <View className="gap-6">
      <AuthFormHeader
        title="Sign in to Jevan Hana"
        subtitle="Welcome back! Please sign in to continue"
      />
      <PreviewLoginActions />
    </View>
  );
}
