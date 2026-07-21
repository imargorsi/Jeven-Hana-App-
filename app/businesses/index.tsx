import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";

import { BusinessCard } from "@/components/BusinessCard";
import { CategoryCard } from "@/components/CategoryChip";
import {
  ErrorState,
  LoadingBlock,
  Screen,
  SearchInput,
  Text,
} from "@/components/ui";
import { href } from "@/lib/navigation.utils";
import {
  getBusinessCategories,
  getBusinesses,
} from "@/lib/services/businesses.service";

export default function BusinessesIndexScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const categoriesQuery = useQuery({
    queryKey: ["business-categories"],
    queryFn: getBusinessCategories,
  });

  const listQuery = useQuery({
    queryKey: ["businesses", query],
    queryFn: () => getBusinesses({ query: query || undefined, limit: 20 }),
  });

  const isSearching = query.trim().length > 0;

  const header = useMemo(
    () => (
      <View className="mb-4">
        <Text variant="bodySmall" tone="muted" className="mb-3">
          Local shops & services · مقامی کاروبار
        </Text>
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search businesses…"
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
                  subtitle={`${cat.nameUrdu} · ${cat.count}`}
                  className="min-w-[46%]"
                  onPress={() =>
                    router.push(href(`/businesses/category/${cat.slug}`))
                  }
                />
              ))}
            </View>
            <Text variant="h3" className="mb-3">
              All listings
            </Text>
          </>
        ) : null}
      </View>
    ),
    [categoriesQuery.data, isSearching, query, router],
  );

  if (categoriesQuery.isLoading || listQuery.isLoading) {
    return (
      <Screen className="px-4" withSafeArea={false}>
        <LoadingBlock />
      </Screen>
    );
  }

  if (listQuery.isError) {
    return (
      <Screen className="px-4" withSafeArea={false}>
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
        renderItem={({ item }) => <BusinessCard business={item} />}
        ListEmptyComponent={
          <Text tone="muted" className="py-8 text-center">
            No businesses found.
          </Text>
        }
      />
    </Screen>
  );
}
