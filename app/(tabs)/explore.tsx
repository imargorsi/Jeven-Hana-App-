import { FlatList, View } from "react-native";

import { BusinessCard } from "@/components/BusinessCard";
import { ErrorState, LoadingBlock, Screen, Text } from "@/components/ui";
import { useBusinessManage } from "@/features/businesses/useBusinessManage.hook";
import { CreateListingActionCard } from "@/features/explore/components/CreateListingActionCard";
import { ExploreCategoryRow } from "@/features/explore/components/ExploreCategoryRow";
import { useExploreListings } from "@/features/explore/useExploreListings.hook";

export default function ExploreScreen() {
  const {
    selectedCategory,
    setSelectedCategory,
    businesses,
    count,
    isLoading,
    isError,
    refetch,
  } = useExploreListings();
  const { canManage, openCreate, openEdit, confirmDelete, deletingId } =
    useBusinessManage();

  if (isLoading) {
    return (
      <Screen>
        <LoadingBlock className="py-16" />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <ErrorState onRetry={() => void refetch()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        className="flex-1"
        data={businesses}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-28 pt-4"
        ListHeaderComponent={
          <View className="mb-5">
            <CreateListingActionCard onPress={openCreate} />

            <ExploreCategoryRow
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />

            <View className="mt-6 flex-row items-end justify-between">
              <View>
                <Text variant="h3">Nearby</Text>
                <Text variant="caption" tone="muted" className="mt-0.5">
                  {count} {count === 1 ? "place" : "places"} in Jevan Hana
                </Text>
              </View>
            </View>
          </View>
        }
        ItemSeparatorComponent={() => <View className="h-4" />}
        renderItem={({ item }) => (
          <BusinessCard
            business={item}
            variant="list"
            canManage={canManage(item)}
            isDeleting={deletingId === item.id}
            onEdit={() => openEdit(item.id)}
            onDelete={() => confirmDelete(item)}
          />
        )}
        ListEmptyComponent={
          <View className="rounded-card border border-dashed border-cream/15 bg-surface/50 px-4 py-12">
            <Text variant="bodySmall" weight="medium" className="text-center">
              No places in this category
            </Text>
            <Text
              variant="caption"
              tone="muted"
              className="mt-1.5 text-center"
            >
              Try another filter or create a listing.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}
