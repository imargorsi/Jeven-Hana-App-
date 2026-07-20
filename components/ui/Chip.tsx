import { Pressable, type PressableProps, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn.utils";

export interface IChipProps extends Omit<PressableProps, "children"> {
  children: string;
  isActive?: boolean;
  className?: string;
}

export function Chip({
  children,
  isActive = false,
  className,
  ...rest
}: IChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        "rounded-chip border px-4 py-2",
        isActive
          ? "border-primary bg-primary"
          : "border-cream/15 bg-surface",
        className,
      )}
      {...rest}
    >
      <Text
        variant="label"
        tone={isActive ? "background" : "cream"}
        weight={isActive ? "semibold" : "medium"}
      >
        {children}
      </Text>
    </Pressable>
  );
}

export interface ICardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: ICardProps) {
  return (
    <View className={cn("rounded-card bg-surface p-4", className)}>
      {children}
    </View>
  );
}
