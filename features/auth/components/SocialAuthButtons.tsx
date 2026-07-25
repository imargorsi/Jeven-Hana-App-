import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";

interface ISocialAuthButtonsProps {
  onGooglePress: () => void;
  isDisabled?: boolean;
  isGoogleLoading?: boolean;
}

/**
 * Google continue button (Facebook SSO removed for v1).
 * Brand mark uses palette tokens for contrast.
 */
export function SocialAuthButtons({
  onGooglePress,
  isDisabled = false,
  isGoogleLoading = false,
}: ISocialAuthButtonsProps) {
  const isInactive = isDisabled || isGoogleLoading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Continue with Google"
      disabled={isInactive}
      onPress={onGooglePress}
      className={cn(
        "min-h-14 w-full flex-row items-center justify-center gap-2.5 rounded-button border border-cream/15 bg-surface active:opacity-90",
        isInactive && "opacity-50",
      )}
    >
      <View
        className="h-8 w-8 items-center justify-center rounded-full"
        style={{ backgroundColor: palette.cream }}
      >
        <Text
          variant="button"
          weight="bold"
          style={{ color: palette.background, fontSize: 16, lineHeight: 20 }}
        >
          G
        </Text>
      </View>
      <Text variant="button" tone="cream" weight="semibold">
        Continue with Google
      </Text>
    </Pressable>
  );
}
