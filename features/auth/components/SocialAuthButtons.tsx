import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";

interface ISocialAuthButtonProps {
  label: string;
  mark: string;
  markBackground: string;
  markColor: string;
  onPress: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
}

function SocialAuthButton({
  label,
  mark,
  markBackground,
  markColor,
  onPress,
  isDisabled = false,
  isLoading = false,
}: ISocialAuthButtonProps) {
  const isInactive = isDisabled || isLoading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Continue with ${label}`}
      disabled={isInactive}
      onPress={onPress}
      className={cn(
        "min-h-14 flex-1 flex-row items-center justify-center gap-2.5 rounded-button border border-cream/15 bg-surface active:opacity-90",
        isInactive && "opacity-50",
      )}
    >
      <View
        className="h-8 w-8 items-center justify-center rounded-full"
        style={{ backgroundColor: markBackground }}
      >
        <Text
          variant="button"
          weight="bold"
          style={{ color: markColor, fontSize: 16, lineHeight: 20 }}
        >
          {mark}
        </Text>
      </View>
      <Text variant="button" tone="cream" weight="semibold">
        {label}
      </Text>
    </Pressable>
  );
}

interface ISocialAuthButtonsProps {
  onGooglePress: () => void;
  onFacebookPress: () => void;
  isDisabled?: boolean;
  isGoogleLoading?: boolean;
  isFacebookLoading?: boolean;
}

/**
 * Social continue buttons. Brand marks use palette tokens (visible without
 * NativeWind class gaps that left empty white circles).
 */
export function SocialAuthButtons({
  onGooglePress,
  onFacebookPress,
  isDisabled = false,
  isGoogleLoading = false,
  isFacebookLoading = false,
}: ISocialAuthButtonsProps) {
  return (
    <View className="flex-row gap-3">
      <SocialAuthButton
        label="Facebook"
        mark="f"
        markBackground={palette.primary}
        markColor={palette.background}
        onPress={onFacebookPress}
        isDisabled={isDisabled}
        isLoading={isFacebookLoading}
      />
      <SocialAuthButton
        label="Google"
        mark="G"
        markBackground={palette.cream}
        markColor={palette.background}
        onPress={onGooglePress}
        isDisabled={isDisabled}
        isLoading={isGoogleLoading}
      />
    </View>
  );
}
