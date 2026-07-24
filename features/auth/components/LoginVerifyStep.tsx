import { useState } from "react";
import { Pressable, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { TextField } from "@/components/ui/TextField";

interface ILoginVerifyStepProps {
  verifyEmailCode: (code: string) => Promise<void>;
  resendEmailCode: () => Promise<void>;
  resetSignIn: () => void;
  isVerifying: boolean;
  getFieldError: (field: string) => string | undefined;
}

export function LoginVerifyStep({
  verifyEmailCode,
  resendEmailCode,
  resetSignIn,
  isVerifying,
  getFieldError,
}: ILoginVerifyStepProps) {
  const [code, setCode] = useState("");
  const codeError = getFieldError("code");

  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text variant="h1" tone="cream" weight="bold">
          Verify your account
        </Text>
        <Text variant="body" tone="muted">
          Enter the code we sent to your email address.
        </Text>
      </View>

      <View className="gap-4">
        <TextField
          label="Verification Code"
          value={code}
          onChangeText={setCode}
          placeholder="Enter your verification code"
          keyboardType="number-pad"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {codeError ? (
          <Text variant="caption" tone="primary">
            {codeError}
          </Text>
        ) : null}
      </View>

      <View className="gap-3">
        <Button
          variant="primary"
          size="lg"
          isFullWidth
          isLoading={isVerifying}
          isDisabled={!code.trim() || isVerifying}
          onPress={() => verifyEmailCode(code)}
        >
          Verify
        </Button>

        <Pressable
          accessibilityRole="button"
          onPress={resendEmailCode}
          className="items-center py-2"
        >
          <Text variant="body" tone="primary" weight="semibold">
            I need a new code
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={resetSignIn}
          className="items-center py-2"
        >
          <Text variant="body" tone="muted" weight="semibold">
            Start over
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
