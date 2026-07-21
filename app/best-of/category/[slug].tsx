import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { FlatList, View } from "react-native";

import { BestOfCard } from "@/components/BestOfCard";
import { ErrorState, LoadingBlock, Screen, Text } from "@/components/ui";
import {
  getBestOfCategories,
  getBestOfListings,
} from "@/lib/services/best-of.service";
import type { TBestOfCategorySlug } from "@/types/best-of.types";

export default function BestOfCategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const categorySlug = slug as TBestOfCategorySlug;

  const categoriesQuery = useQuery({
    queryKey: ["best-of-categories"],
    queryFn: getBestOfCategories,
  });

  const listQuery = useQuery({
    queryKey: ["best-of", categorySlug],
    queryFn: () => getBestOfListings({ categorySlug }),
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
              <Text variant="bodySmall" tone="muted" className="mb-4">
                {category.description}
              </Text>
            ) : null
          }
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <BestOfCard listing={item} variant="vertical" />
          )}
          ListEmptyComponent={
            <Text tone="muted" className="py-8 text-center">
              No recommendations yet.
            </Text>
          }
        />
      )}
    </Screen>
  );
}
