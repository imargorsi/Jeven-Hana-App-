import { FlatList, View } from "react-native";

import { BusinessCard } from "@/components/BusinessCard";
import {
  BusinessListSkeleton,
  EmptyState,
  ErrorState,
  Screen,
  Text,
} from "@/components/ui";
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

  if (isError && !isLoading) {
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
        data={isLoading ? [] : businesses}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-28 pt-4"
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={7}
        removeClippedSubviews
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
                  {isLoading
                    ? "Loading Places…"
                    : `${count} ${count === 1 ? "place" : "places"} in Jevan Hana`}
                </Text>
              </View>
            </View>
          </View>
        }
        ListFooterComponent={
          isLoading ? (
            <BusinessListSkeleton count={3} className="mt-4" />
          ) : null
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
          isLoading ? null : (
            <EmptyState
              title="No Places Found"
              description="Nothing in this category yet. Try another filter or create a listing."
            />
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}
