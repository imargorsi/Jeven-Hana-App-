import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { FlatList, View } from "react-native";

import { PlaceCard } from "@/components/PlaceCard";
import { ErrorState, LoadingBlock, Screen, Text } from "@/components/ui";
import { getPlaceCategories, getPlaces } from "@/lib/services/places.service";
import type { TPlaceCategorySlug } from "@/types/place.types";

export default function PlaceCategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const categorySlug = slug as TPlaceCategorySlug;

  const categoriesQuery = useQuery({
    queryKey: ["place-categories"],
    queryFn: getPlaceCategories,
  });

  const listQuery = useQuery({
    queryKey: ["places", "category", categorySlug],
    queryFn: () => getPlaces({ categorySlug, limit: 40 }),
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
          renderItem={({ item }) => <PlaceCard place={item} />}
          ListEmptyComponent={
            <Text tone="muted" className="py-8 text-center">
              No places in this category yet.
            </Text>
          }
        />
      )}
    </Screen>
  );
}
