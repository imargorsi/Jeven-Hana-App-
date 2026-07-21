import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { FlatList, View } from "react-native";

import { BestOfCard } from "@/components/BestOfCard";
import { CategoryCard } from "@/components/CategoryChip";
import { ErrorState, LoadingBlock, Screen, Text } from "@/components/ui";
import { href } from "@/lib/navigation.utils";
import {
  getBestOfCategories,
  getBestOfListings,
} from "@/lib/services/best-of.service";

export default function BestOfIndexScreen() {
  const router = useRouter();

  const categoriesQuery = useQuery({
    queryKey: ["best-of-categories"],
    queryFn: getBestOfCategories,
  });

  const listQuery = useQuery({
    queryKey: ["best-of-listings"],
    queryFn: () => getBestOfListings({ limit: 20 }),
  });

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
        ListHeaderComponent={
          <View className="mb-4">
            <Text variant="h2" className="mb-1">
              Jevan Hana Ka Best
            </Text>
            <Text variant="bodySmall" tone="muted" className="mb-4" isUrdu>
              مقامی بہترین انتخاب
            </Text>
            <View className="mb-4 flex-row flex-wrap gap-3">
              {(categoriesQuery.data ?? []).map((cat) => (
                <CategoryCard
                  key={cat.slug}
                  title={cat.name}
                  subtitle={cat.nameUrdu}
                  className="min-w-[46%]"
                  onPress={() => router.push(href(`/best-of/category/${cat.slug}`))}
                />
              ))}
            </View>
            <Text variant="h3" className="mb-3">
              Featured recommendations
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <BestOfCard listing={item} variant="vertical" />
        )}
      />
    </Screen>
  );
}
