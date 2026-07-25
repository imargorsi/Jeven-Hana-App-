import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn.utils";

interface ISectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  isUrdu?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  actionLabel = "View All",
  onActionPress,
  isUrdu = false,
  className,
}: ISectionHeaderProps) {
  const hasAction = Boolean(onActionPress);

  return (
    <View
      className={cn(
        "mb-4 flex-row items-center justify-between gap-3",
        className,
      )}
    >
      <View className={cn("min-w-0", hasAction ? "flex-1" : "w-full")}>
        <Text
          variant="h3"
          isUrdu={isUrdu}
          className={cn(isUrdu && "text-left")}
          style={isUrdu ? { textAlign: "left" } : undefined}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            variant="caption"
            tone="muted"
            isUrdu={isUrdu}
            className={cn("mt-0.5", isUrdu && "text-left")}
            style={isUrdu ? { textAlign: "left" } : undefined}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {hasAction ? (
        <Pressable
          onPress={onActionPress}
          hitSlop={8}
          className="shrink-0 self-center"
        >
          <Text variant="label" tone="primary">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
