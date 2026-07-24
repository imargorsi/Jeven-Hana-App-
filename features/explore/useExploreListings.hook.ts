import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import type { TExploreCategoryKey } from "@/features/explore/explore.icons";
import { getBusinesses } from "@/lib/services/businesses.service";
import type { TBusinessCategorySlug } from "@/types/business.types";

export function useExploreListings() {
  const [selectedCategory, setSelectedCategory] =
    useState<TExploreCategoryKey>("all");

  const category =
    selectedCategory === "all"
      ? undefined
      : (selectedCategory as TBusinessCategorySlug);

  const listQuery = useQuery({
    queryKey: ["explore-businesses", selectedCategory],
    queryFn: () =>
      getBusinesses({
        category,
        limit: 40,
      }),
  });

  return {
    selectedCategory,
    setSelectedCategory,
    businesses: listQuery.data?.items ?? [],
    count: listQuery.data?.items.length ?? 0,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    refetch: listQuery.refetch,
  };
}
