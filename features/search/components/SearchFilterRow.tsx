import { Pressable, ScrollView, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn.utils";
import type { TSearchTab } from "@/types/search.types";

const TAB_LABEL: Record<TSearchTab, string> = {
  all: "All",
  businesses: "Businesses",
  community: "Community",
  events: "Events",
};

export const SEARCH_FILTERS: { key: TSearchTab; label: string }[] = [
  { key: "all", label: TAB_LABEL.all },
  { key: "businesses", label: TAB_LABEL.businesses },
  { key: "community", label: TAB_LABEL.community },
  { key: "events", label: TAB_LABEL.events },
];

export { TAB_LABEL };

interface ISearchFilterRowProps {
  selected: TSearchTab;
  onSelect: (key: TSearchTab) => void;
  className?: string;
}

/** Soft filter pills for search results (matches Community). */
export function SearchFilterRow({
  selected,
  onSelect,
  className,
}: ISearchFilterRowProps) {
  return (
    <View className={cn(className)}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2"
      >
        {SEARCH_FILTERS.map((filter) => {
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
