import type { TBusinessCategorySlug } from "@/types/business.types";

export type TExploreCategoryKey = "all" | TBusinessCategorySlug;

type TSymbolName = {
  ios: string;
  android: string;
  web: string;
};

/** SF / Material icon map for Explore category tiles. */
export const EXPLORE_CATEGORY_ICONS: Record<TExploreCategoryKey, TSymbolName> = {
  all: {
    ios: "square.grid.2x2",
    android: "grid_view",
    web: "grid_view",
  },
  restaurants: {
    ios: "fork.knife",
    android: "restaurant",
    web: "restaurant",
  },
  cafes: {
    ios: "cup.and.saucer.fill",
    android: "local_cafe",
    web: "local_cafe",
  },
  grocery: {
    ios: "cart.fill",
    android: "shopping_cart",
    web: "shopping_cart",
  },
  pharmacies: {
    ios: "cross.case.fill",
    android: "local_pharmacy",
    web: "local_pharmacy",
  },
  salons: {
    ios: "scissors",
    android: "content_cut",
    web: "content_cut",
  },
  electricians: {
    ios: "bolt.fill",
    android: "bolt",
    web: "bolt",
  },
  plumbers: {
    ios: "wrench.fill",
    android: "plumbing",
    web: "plumbing",
  },
  mechanics: {
    ios: "car.fill",
    android: "directions_car",
    web: "directions_car",
  },
  tailors: {
    ios: "tshirt.fill",
    android: "checkroom",
    web: "checkroom",
  },
  tutors: {
    ios: "book.fill",
    android: "menu_book",
    web: "menu_book",
  },
  gyms: {
    ios: "figure.strengthtraining.traditional",
    android: "fitness_center",
    web: "fitness_center",
  },
  "home-services": {
    ios: "house.fill",
    android: "home_repair_service",
    web: "home_repair_service",
  },
};

export function getExploreCategoryIcon(
  key: TExploreCategoryKey,
): TSymbolName {
  return EXPLORE_CATEGORY_ICONS[key] ?? EXPLORE_CATEGORY_ICONS.all;
}
