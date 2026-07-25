import { ActivityIndicator, Image, Pressable } from "react-native";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";

interface ISocialAuthButtonsProps {
  onGooglePress: () => void;
  isDisabled?: boolean;
  isGoogleLoading?: boolean;
}

/**
 * Official-style Google continue button — white surface, blue outline, real G mark.
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
        "min-h-14 w-full flex-row items-center justify-center gap-3 rounded-button active:opacity-90",
        isInactive && "opacity-50",
      )}
      style={{
        backgroundColor: palette.googleButtonBg,
        borderWidth: 1.5,
        borderColor: palette.googleButtonBorder,
      }}
    >
      {isGoogleLoading ? (
        <ActivityIndicator color={palette.googleButtonText} />
      ) : (
        <>
          <Image
            source={require("@/assets/images/google-g.png")}
            style={{ width: 22, height: 22 }}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
          <Text
            variant="button"
            weight="medium"
            style={{ color: palette.googleButtonText }}
          >
            Continue with Google
          </Text>
        </>
      )}
    </Pressable>
  );
}
