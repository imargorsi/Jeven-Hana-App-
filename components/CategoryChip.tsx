import { Pressable } from "react-native";

import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn.utils";

interface ICategoryChipProps {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
  className?: string;
}

export function CategoryChip({
  label,
  isActive,
  onPress,
  className,
}: ICategoryChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "mr-2 rounded-chip border px-3.5 py-2",
        isActive
          ? "border-primary bg-primary"
          : "border-cream/15 bg-surface",
        className,
      )}
    >
      <Text
        variant="label"
        tone={isActive ? "background" : "cream"}
        weight={isActive ? "semibold" : "medium"}
      >
        {label}
      </Text>
    </Pressable>
  );
}

interface ICategoryCardProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  className?: string;
}

export function CategoryCard({
  title,
  subtitle,
  onPress,
  className,
}: ICategoryCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "min-h-[88px] flex-1 rounded-card border border-cream/10 bg-surface p-4 active:opacity-90",
        className,
      )}
    >
      <Text variant="bodySmall" weight="semibold">
        {title}
      </Text>
      {subtitle ? (
        <Text variant="caption" tone="muted" className="mt-1" isUrdu={/[؀-ۿ]/.test(subtitle)}>
          {subtitle}
        </Text>
      ) : null}
    </Pressable>
  );
}
