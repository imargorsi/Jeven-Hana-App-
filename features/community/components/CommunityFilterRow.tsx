import { Pressable, ScrollView, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn.utils";
import type { TPostCategory } from "@/types/community.types";

export type TCommunityFilterKey = TPostCategory | "all";

export const COMMUNITY_FILTERS: {
  key: TCommunityFilterKey;
  label: string;
}[] = [
  { key: "all", label: "All" },
  { key: "announcement", label: "Announcements" },
  { key: "news", label: "News" },
  { key: "local-update", label: "Updates" },
  { key: "recommendation", label: "Tips" },
  { key: "lost-found", label: "Lost & found" },
];

interface ICommunityFilterRowProps {
  selected: TCommunityFilterKey;
  onSelect: (key: TCommunityFilterKey) => void;
  className?: string;
}

/** Soft filter pills for the Community feed (v1). */
export function CommunityFilterRow({
  selected,
  onSelect,
  className,
}: ICommunityFilterRowProps) {
  return (
    <View className={cn(className)}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 px-4"
      >
        {COMMUNITY_FILTERS.map((filter) => {
          const isActive = selected === filter.key;

          return (
            <Pressable
              key={filter.key}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={filter.label}
              onPress={() => onSelect(filter.key)}
              className={cn(
                "rounded-full px-3.5 py-2 active:opacity-80",
                isActive ? "bg-primary/15" : "bg-surface",
              )}
            >
              <Text
                variant="caption"
                weight={isActive ? "semibold" : "medium"}
                tone={isActive ? "primary" : "muted"}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
