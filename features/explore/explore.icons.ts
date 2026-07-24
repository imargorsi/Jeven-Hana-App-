/**
 * SF / Material icon map for Explore category tiles.
 * Fixed v1: All + food | masjid | shops | parks
 */
import type { SymbolView } from "expo-symbols";
import type { ComponentProps } from "react";

import type { TBusinessCategorySlug } from "@/types/business.types";

export type TExploreCategoryKey = "all" | TBusinessCategorySlug;

type TSymbolName = NonNullable<ComponentProps<typeof SymbolView>["name"]>;

export const EXPLORE_CATEGORY_ICONS = {
  all: {
    ios: "square.grid.2x2",
    android: "grid_view",
    web: "grid_view",
  },
  food: {
    ios: "fork.knife",
    android: "restaurant",
    web: "restaurant",
  },
  masjid: {
    ios: "building.columns.fill",
    android: "mosque",
    web: "mosque",
  },
  shops: {
    ios: "bag.fill",
    android: "store",
    web: "store",
  },
  parks: {
    ios: "leaf.fill",
    android: "park",
    web: "park",
  },
} as const satisfies Record<TExploreCategoryKey, TSymbolName>;

export function getExploreCategoryIcon(
  key: TExploreCategoryKey,
): TSymbolName {
  return EXPLORE_CATEGORY_ICONS[key] ?? EXPLORE_CATEGORY_ICONS.all;
}
