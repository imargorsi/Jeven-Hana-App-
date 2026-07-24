import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";

interface ISearchChipCloudProps {
  title: string;
  items: string[];
  onSelect: (value: string) => void;
  onClear?: () => void;
  onLongPressItem?: (value: string) => void;
  /** Use trending (flame) icon instead of clock/history. */
  variant?: "recent" | "trending" | "suggestion";
  className?: string;
}

/** Soft wrap chips for recent / trending / suggestions. */
export function SearchChipCloud({
  title,
  items,
  onSelect,
  onClear,
  onLongPressItem,
  variant = "recent",
  className,
}: ISearchChipCloudProps) {
  if (items.length === 0) return null;

  const iconName =
    variant === "trending"
      ? {
          ios: "flame.fill" as const,
          android: "local_fire_department" as const,
          web: "local_fire_department" as const,
        }
      : variant === "suggestion"
        ? {
            ios: "sparkles" as const,
            android: "auto_awesome" as const,
            web: "auto_awesome" as const,
          }
        : {
            ios: "clock" as const,
            android: "history" as const,
            web: "history" as const,
          };

  return (
    <View className={cn(className)}>
      <View className="mb-2 flex-row items-center justify-between">
        <Text variant="caption" weight="semibold" tone="muted">
          {title}
        </Text>
        {onClear ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear Recent Searches"
            onPress={onClear}
            hitSlop={8}
            className="active:opacity-70"
          >
            <Text variant="caption" weight="semibold" tone="primary">
              Clear
            </Text>
          </Pressable>
        ) : null}
      </View>

      <View className="flex-row flex-wrap gap-2">
        {items.map((item) => (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityLabel={item}
            onPress={() => onSelect(item)}
            onLongPress={
              onLongPressItem ? () => onLongPressItem(item) : undefined
            }
            className="flex-row items-center gap-1.5 rounded-full border border-cream/10 bg-surface px-3 py-2 active:opacity-80"
          >
            <SymbolView
              name={iconName}
              size={12}
              tintColor={palette.primary}
            />
            <Text variant="caption" weight="medium" numberOfLines={1}>
              {item}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
