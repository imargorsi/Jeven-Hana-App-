import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";

import { CategoryCard } from "@/components/CategoryChip";
import { PlaceCard } from "@/components/PlaceCard";
import {
  ErrorState,
  LoadingBlock,
  Screen,
  SearchInput,
  Text,
} from "@/components/ui";
import { href } from "@/lib/navigation.utils";
import { getPlaceCategories, getPlaces } from "@/lib/services/places.service";

export default function PlacesIndexScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const categoriesQuery = useQuery({
    queryKey: ["place-categories"],
    queryFn: getPlaceCategories,
  });

  const listQuery = useQuery({
    queryKey: ["places", query],
    queryFn: () => getPlaces({ query: query || undefined, limit: 30 }),
  });

  const isSearching = query.trim().length > 0;

  const header = useMemo(
    () => (
      <View className="mb-4">
        <Text variant="bodySmall" tone="muted" className="mb-3">
          Mosques, parks & essentials · مقامات
        </Text>
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search places…"
          onClear={() => setQuery("")}
          className="mb-4"
        />
        {!isSearching ? (
          <>
            <Text variant="h3" className="mb-3">
              Categories
            </Text>
            <View className="mb-4 flex-row flex-wrap gap-3">
              {(categoriesQuery.data ?? []).map((cat) => (
                <CategoryCard
                  key={cat.slug}
                  title={cat.name}
                  subtitle={cat.nameUrdu}
                  className="min-w-[46%]"
                  onPress={() => router.push(href(`/places/category/${cat.slug}`))}
                />
              ))}
            </View>
            <Text variant="h3" className="mb-3">
              Nearby
            </Text>
          </>
        ) : null}
      </View>
    ),
    [categoriesQuery.data, isSearching, query, router],
  );

  if (categoriesQuery.isLoading || listQuery.isLoading) {
    return (
      <Screen withSafeArea={false} className="px-4">
        <LoadingBlock />
      </Screen>
    );
  }

  if (listQuery.isError) {
    return (
      <Screen withSafeArea={false} className="px-4">
        <ErrorState onRetry={() => void listQuery.refetch()} />
      </Screen>
    );
  }

  return (
    <Screen withSafeArea={false}>
      <FlatList
        data={listQuery.data?.items ?? []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-10 pt-2"
        ListHeaderComponent={header}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => <PlaceCard place={item} />}
        ListEmptyComponent={
          <Text tone="muted" className="py-8 text-center">
            No places found.
          </Text>
        }
      />
    </Screen>
  );
}
