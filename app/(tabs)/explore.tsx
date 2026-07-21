import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { BestOfCard } from "@/components/BestOfCard";
import { BusinessCard } from "@/components/BusinessCard";
import { CategoryChip } from "@/components/CategoryChip";
import { PlaceCard } from "@/components/PlaceCard";
import {
  Screen,
  SearchInput,
  SectionHeader,
  Text,
  LoadingBlock,
  ErrorState,
} from "@/components/ui";
import { href } from "@/lib/navigation.utils";
import { getBestOfListings } from "@/lib/services/best-of.service";
import { getBusinessCategories, getBusinesses } from "@/lib/services/businesses.service";
import { getPlaces } from "@/lib/services/places.service";

type TExploreFilter = "all" | "businesses" | "places" | "best-of";

export default function ExploreScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<TExploreFilter>("all");
  const [isGrid, setIsGrid] = useState(false);

  const query = useQuery({
    queryKey: ["explore-hub"],
    queryFn: async () => {
      const [categories, businesses, places, bestOf, topRated] =
        await Promise.all([
          getBusinessCategories(),
          getBusinesses({ featuredOnly: true, limit: 8 }),
          getPlaces({ nearbyOnly: true, limit: 8 }),
          getBestOfListings({ limit: 6 }),
          getBusinesses({ topRatedOnly: true, limit: 8 }),
        ]);
      return { categories, businesses, places, bestOf, topRated };
    },
  });

  if (query.isLoading) {
    return (
      <Screen className="px-4">
        <Text variant="h2" className="mb-4">
          Explore
        </Text>
        <LoadingBlock />
      </Screen>
    );
  }

  if (query.isError || !query.data) {
    return (
      <Screen className="px-4">
        <ErrorState onRetry={() => void query.refetch()} />
      </Screen>
    );
  }

  const { categories, businesses, places, bestOf, topRated } = query.data;

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h2" className="mb-1">
          Explore
        </Text>
        <Text variant="bodySmall" tone="muted" className="mb-4">
          Discover Jevan Hana · دریافت کریں
        </Text>

        <SearchInput
          value=""
          onChangeText={() => undefined}
          onPress={() => router.push(href("/search"))}
          className="mb-4"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-5"
        >
          {(
            [
              ["all", "All"],
              ["businesses", "Businesses"],
              ["places", "Places"],
              ["best-of", "Ka Best"],
            ] as const
          ).map(([key, label]) => (
            <CategoryChip
              key={key}
              label={label}
              isActive={filter === key}
              onPress={() => setFilter(key)}
            />
          ))}
        </ScrollView>

        <View className="mb-6 flex-row gap-3">
          <Pressable
            onPress={() => router.push(href("/businesses"))}
            className="flex-1 rounded-card border border-cream/10 bg-surface p-4"
          >
            <Text variant="bodySmall" weight="semibold">
              Business Directory
            </Text>
            <Text variant="caption" tone="muted" className="mt-1">
              Restaurants, shops & services
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push(href("/places"))}
            className="flex-1 rounded-card border border-cream/10 bg-surface p-4"
          >
            <Text variant="bodySmall" weight="semibold">
              Places Directory
            </Text>
            <Text variant="caption" tone="muted" className="mt-1">
              Mosques, parks & more
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.push(href("/best-of"))}
          className="mb-6 rounded-card border border-primary/30 bg-primary/10 p-4"
        >
          <Text variant="h3">Jevan Hana Ka Best</Text>
          <Text variant="caption" tone="muted" className="mt-1">
            Neighbour-voted local favourites
          </Text>
        </Pressable>

        <SectionHeader title="Popular categories" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
        >
          {categories.slice(0, 8).map((cat) => (
            <CategoryChip
              key={cat.slug}
              label={cat.name}
              onPress={() =>
                router.push(href(`/businesses/category/${cat.slug}`))
              }
            />
          ))}
        </ScrollView>

        {(filter === "all" || filter === "best-of") && (
          <>
            <SectionHeader
              title="Ka Best picks"
              onActionPress={() => router.push(href("/best-of"))}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-6"
              contentContainerClassName="gap-3"
            >
              {bestOf.items.map((listing) => (
                <BestOfCard key={listing.id} listing={listing} />
              ))}
            </ScrollView>
          </>
        )}

        {(filter === "all" || filter === "businesses") && (
          <>
            <View className="mb-3 flex-row items-center justify-between">
              <SectionHeader
                title="Top-rated listings"
                onActionPress={() => router.push(href("/businesses"))}
                className="mb-0 flex-1"
              />
              <Pressable onPress={() => setIsGrid((v) => !v)} hitSlop={8}>
                <Text variant="label" tone="primary">
                  {isGrid ? "List" : "Grid"}
                </Text>
              </Pressable>
            </View>
            <View
              className={
                isGrid ? "mb-6 flex-row flex-wrap gap-3" : "mb-6 gap-3"
              }
            >
              {topRated.items.map((biz) => (
                <BusinessCard
                  key={biz.id}
                  business={biz}
                  variant={isGrid ? "vertical" : "compact"}
                  className={isGrid ? "w-[48%]" : undefined}
                />
              ))}
            </View>
          </>
        )}

        {(filter === "all" || filter === "places") && (
          <>
            <SectionHeader
              title="Nearby listings"
              onActionPress={() => router.push(href("/places"))}
            />
            <View className="gap-3">
              {places.items.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </View>
          </>
        )}

        {filter === "businesses" && businesses.items.length > 0 ? (
          <View className="mt-4 gap-3">
            {businesses.items.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}
