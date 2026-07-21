import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, Stack } from "expo-router";
import { FlatList, View } from "react-native";

import { BusinessCard } from "@/components/BusinessCard";
import { ErrorState, LoadingBlock, Screen, Text } from "@/components/ui";
import {
  getBusinessCategories,
  getBusinesses,
} from "@/lib/services/businesses.service";
import type { TBusinessCategorySlug } from "@/types/business.types";

export default function BusinessCategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const categorySlug = slug as TBusinessCategorySlug;

  const categoriesQuery = useQuery({
    queryKey: ["business-categories"],
    queryFn: getBusinessCategories,
  });

  const listQuery = useQuery({
    queryKey: ["businesses", "category", categorySlug],
    queryFn: () => getBusinesses({ categorySlug, limit: 40 }),
    enabled: Boolean(categorySlug),
  });

  const category = categoriesQuery.data?.find((c) => c.slug === categorySlug);

  return (
    <Screen withSafeArea={false}>
      <Stack.Screen options={{ title: category?.name ?? "Category" }} />
      {listQuery.isLoading ? (
        <LoadingBlock />
      ) : listQuery.isError ? (
        <ErrorState onRetry={() => void listQuery.refetch()} />
      ) : (
        <FlatList
          data={listQuery.data?.items ?? []}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-10 pt-2"
          ListHeaderComponent={
            category ? (
              <Text variant="bodySmall" tone="muted" className="mb-4" isUrdu>
                {category.nameUrdu}
              </Text>
            ) : null
          }
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => <BusinessCard business={item} />}
          ListEmptyComponent={
            <Text tone="muted" className="py-8 text-center">
              No listings in this category yet.
            </Text>
          }
        />
      )}
    </Screen>
  );
}
