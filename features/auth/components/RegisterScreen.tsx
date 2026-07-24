import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { View } from "react-native";

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
import { RegisterVerifyStep } from "@/features/auth/components/RegisterVerifyStep";
import { SocialAuthButtons } from "@/features/auth/components/SocialAuthButtons";
import { useClerkRegister } from "@/features/auth/useClerkRegister.hook";
import { useClerkSocialAuth } from "@/features/auth/useClerkSocialAuth.hook";

function PreviewRegisterActions() {
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
        prompt="Already have an account?"
        linkLabel="Sign in"
        href="/login"
      />
    </>
  );
}

function ClerkRegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    verifyEmailCode,
    resendEmailCode,
    needsEmailVerification,
    isSubmitting,
    isVerifying,
    getFieldError,
  } = useClerkRegister();
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
      <RegisterVerifyStep
        verifyEmailCode={verifyEmailCode}
        resendEmailCode={resendEmailCode}
        isVerifying={isVerifying}
        getFieldError={getFieldError}
      />
    );
  }

  return (
    <View className="gap-6">
      <AuthFormHeader
        title="Create Your Account"
        subtitle="Welcome! Please fill in the details to get started."
      />

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
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="username"
        />
        {getFieldError("username") ? (
          <Text variant="caption" tone="primary">
            {getFieldError("username")}
          </Text>
        ) : null}

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
        {getFieldError("emailAddress") ? (
          <Text variant="caption" tone="primary">
            {getFieldError("emailAddress")}
          </Text>
        ) : null}

        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password"
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
      </View>

      <View className="gap-4">
        <Button
          variant="primary"
          size="lg"
          isFullWidth
          isLoading={isSubmitting}
          isDisabled={isBusy}
          onPress={() =>
            register({
              username,
              email,
              password,
            })
          }
        >
          Continue
        </Button>
        <AuthFooterLink
        prompt="Already have an account?"
        linkLabel="Sign in"
        href="/login"
      />
      </View>

      <View nativeID="clerk-captcha" />
    </View>
  );
}

export function RegisterScreen() {
  return (
    <AuthScreenShell>
      {isClerkConfigured ? <ClerkRegisterForm /> : <PreviewRegisterContent />}
    </AuthScreenShell>
  );
}

function PreviewRegisterContent() {
  return (
    <View className="gap-6">
      <AuthFormHeader
        title="Create Your Account"
        subtitle="Welcome! Please fill in the details to get started."
      />
      <PreviewRegisterActions />
    </View>
  );
}
