import { SymbolView } from "expo-symbols";
import { Pressable, type PressableProps } from "react-native";
import { View } from "react-native";

import { palette } from "@/constants/Colors";
import { iconSizes } from "@/constants/tokens";
import { cn } from "@/lib/cn.utils";

type TSymbolName =
  | string
  | { ios: string; android: string; web: string };

interface IIconButtonProps extends Omit<PressableProps, "children"> {
  name: TSymbolName;
  size?: number;
  tintColor?: string;
  badgeCount?: number;
  className?: string;
}

export function IconButton({
  name,
  size = iconSizes.lg,
  tintColor = palette.cream,
  badgeCount,
  className,
  ...rest
}: IIconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        "h-10 w-10 items-center justify-center rounded-full active:opacity-70",
        className,
      )}
      {...rest}
    >
      <SymbolView
        name={name as never}
        size={size}
        tintColor={tintColor}
      />
      {badgeCount && badgeCount > 0 ? (
        <View className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-primary" />
      ) : null}
    </Pressable>
  );
}
