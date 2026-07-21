import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  View,
} from "react-native";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";

export type TButtonVariant = "primary" | "secondary" | "ghost" | "success";
export type TButtonSize = "sm" | "md" | "lg";

export interface IButtonProps extends Omit<PressableProps, "children"> {
  children: React.ReactNode;
  variant?: TButtonVariant;
  size?: TButtonSize;
  isLoading?: boolean;
  isDisabled?: boolean;
  isFullWidth?: boolean;
  className?: string;
  textClassName?: string;
}

const sizeClassName: Record<TButtonSize, string> = {
  sm: "min-h-11 px-4 py-2.5",
  md: "min-h-12 px-5 py-3",
  lg: "min-h-14 px-6 py-3.5",
};

const variantClassName: Record<TButtonVariant, string> = {
  primary: "bg-primary",
  secondary: "border border-primary bg-transparent",
  ghost: "bg-transparent",
  success: "bg-success",
};

const textTone: Record<
  TButtonVariant,
  "background" | "primary" | "cream"
> = {
  primary: "background",
  secondary: "primary",
  ghost: "cream",
  success: "cream",
};

const spinnerColor: Record<TButtonVariant, string> = {
  primary: palette.background,
  secondary: palette.primary,
  ghost: palette.cream,
  success: palette.cream,
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  isDisabled = false,
  isFullWidth = false,
  className,
  textClassName,
  ...rest
}: IButtonProps) {
  const isInactive = isDisabled || isLoading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isInactive}
      className={cn(
        "items-center justify-center overflow-visible rounded-button active:opacity-90",
        sizeClassName[size],
        variantClassName[variant],
        isFullWidth && "w-full",
        isInactive && "opacity-50",
        className,
      )}
      {...rest}
    >
      {isLoading ? (
        <View className="py-1">
          <ActivityIndicator color={spinnerColor[variant]} />
        </View>
      ) : typeof children === "string" ? (
        <Text
          variant="button"
          tone={textTone[variant]}
          className={textClassName}
          style={{ includeFontPadding: true }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
