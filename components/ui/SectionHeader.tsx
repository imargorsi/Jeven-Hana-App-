import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn.utils";

interface ISectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  actionLabel = "View All",
  onActionPress,
  className,
}: ISectionHeaderProps) {
  return (
    <View className={cn("mb-3 flex-row items-end justify-between", className)}>
      <View className="flex-1 pr-3">
        <Text variant="h3">{title}</Text>
        {subtitle ? (
          <Text variant="caption" tone="muted" className="mt-0.5">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {onActionPress ? (
        <Pressable onPress={onActionPress} hitSlop={8}>
          <Text variant="label" tone="primary">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
