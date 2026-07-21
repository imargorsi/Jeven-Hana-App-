import { useState } from "react";
import { Pressable, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { TextField } from "@/components/ui/TextField";

interface IRegisterVerifyStepProps {
  verifyEmailCode: (code: string) => Promise<void>;
  resendEmailCode: () => Promise<void>;
  isVerifying: boolean;
  getFieldError: (field: string) => string | undefined;
}

export function RegisterVerifyStep({
  verifyEmailCode,
  resendEmailCode,
  isVerifying,
  getFieldError,
}: IRegisterVerifyStepProps) {
  const [code, setCode] = useState("");
  const codeError = getFieldError("code");

  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text variant="h1" tone="cream" weight="bold">
          Verify your email
        </Text>
        <Text variant="body" tone="muted">
          Enter the code we sent to your email address.
        </Text>
      </View>

      <View className="gap-4">
        <TextField
          label="Verification code"
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
      </View>
    </View>
  );
}
