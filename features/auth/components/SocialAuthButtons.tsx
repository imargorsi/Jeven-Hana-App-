import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn.utils";

interface ISocialAuthButtonProps {
  label: string;
  badge: string;
  badgeClassName?: string;
  badgeTextTone?: "background" | "cream";
  onPress: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
}

function SocialAuthButton({
  label,
  badge,
  badgeClassName,
  badgeTextTone = "background",
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
        "min-h-14 flex-1 flex-row items-center justify-center gap-2 rounded-button border border-cream/15 bg-surface active:opacity-90",
        isInactive && "opacity-50",
      )}
    >
      <View
        className={cn(
          "h-7 w-7 items-center justify-center rounded-full",
          badgeClassName ?? "bg-cream",
        )}
      >
        <Text variant="button" tone={badgeTextTone} weight="bold">
          {badge}
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
        badge="f"
        onPress={onFacebookPress}
        isDisabled={isDisabled}
        isLoading={isFacebookLoading}
      />
      <SocialAuthButton
        label="Google"
        badge="G"
        onPress={onGooglePress}
        isDisabled={isDisabled}
        isLoading={isGoogleLoading}
      />
    </View>
  );
}
