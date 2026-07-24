import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import {
  getExploreCategoryIcon,
  type TExploreCategoryKey,
} from "@/features/explore/explore.icons";
import { cn } from "@/lib/cn.utils";

/** Categories shown in a single icon row on Explore. */
export const EXPLORE_ROW_CATEGORIES: {
  key: TExploreCategoryKey;
  label: string;
}[] = [
  { key: "all", label: "All" },
  { key: "food", label: "Food" },
  { key: "masjid", label: "Masjid" },
  { key: "shops", label: "Shops" },
  { key: "parks", label: "Parks" },
];

interface IExploreCategoryRowProps {
  selected: TExploreCategoryKey;
  onSelect: (key: TExploreCategoryKey) => void;
  className?: string;
}

export function ExploreCategoryRow({
  selected,
  onSelect,
  className,
}: IExploreCategoryRowProps) {
  return (
    <View className={cn("flex-row items-start justify-between", className)}>
      {EXPLORE_ROW_CATEGORIES.map((tile) => {
        const isActive = selected === tile.key;
        const icon = getExploreCategoryIcon(tile.key);

        return (
          <Pressable
            key={tile.key}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tile.label}
            onPress={() => onSelect(tile.key)}
            className="w-[18%] items-center active:opacity-80"
          >
            <View
              className={cn(
                "h-12 w-12 items-center justify-center",
                isActive
                  ? "rounded-2xl bg-primary/15"
                  : "rounded-full bg-surface",
              )}
            >
              <SymbolView
                name={icon}
                size={20}
                tintColor={isActive ? palette.primary : palette.cream}
              />
            </View>
            <Text
              variant="caption"
              weight={isActive ? "semibold" : "medium"}
              tone={isActive ? "primary" : "muted"}
              className="mt-2 text-center"
              numberOfLines={1}
            >
              {tile.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
