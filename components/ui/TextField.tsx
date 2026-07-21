import {
  Pressable,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";
import { cn } from "@/lib/cn.utils";
import { withAlpha } from "@/lib/color.utils";

export interface ITextFieldProps extends TextInputProps {
  label: string;
  labelRight?: React.ReactNode;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  onRightPress?: () => void;
  containerClassName?: string;
}

export function TextField({
  label,
  labelRight,
  leftSlot,
  rightSlot,
  onRightPress,
  containerClassName,
  className,
  ...rest
}: ITextFieldProps) {
  return (
    <View className={cn("w-full gap-2", containerClassName)}>
      <View className="flex-row items-center justify-between">
        <Text variant="label" tone="cream" weight="medium" className="opacity-70">
          {label}
        </Text>
        {labelRight}
      </View>

      <View className="min-h-14 flex-row items-center rounded-button border border-cream/15 bg-surface px-4">
        {leftSlot ? <View className="mr-3">{leftSlot}</View> : null}

        <TextInput
          className={cn("flex-1 py-3 text-base text-cream", className)}
          placeholderTextColor={withAlpha(palette.cream, 0.4)}
          style={{ fontFamily: fonts.english.regular }}
          {...rest}
        />

        {rightSlot ? (
          <Pressable
            accessibilityRole="button"
            onPress={onRightPress}
            disabled={!onRightPress}
            className="ml-3"
            hitSlop={8}
          >
            {rightSlot}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
