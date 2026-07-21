import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { FlatList, View } from "react-native";

import { BestOfCard } from "@/components/BestOfCard";
import { BusinessCard } from "@/components/BusinessCard";
import { CategoryChip } from "@/components/CategoryChip";
import { EventCard } from "@/components/EventCard";
import { PlaceCard } from "@/components/PlaceCard";
import { EmptyState, LoadingBlock, Screen } from "@/components/ui";
import { getBestOfById } from "@/lib/services/best-of.service";
import { getBusinessById } from "@/lib/services/businesses.service";
import { getEventById } from "@/lib/services/events.service";
import { getPlaceById } from "@/lib/services/places.service";
import { useSavedItemsStore } from "@/stores/useSavedItemsStore";
import type { IBestOfListing } from "@/types/best-of.types";
import type { IBusiness } from "@/types/business.types";
import type { IEvent } from "@/types/event.types";
import type { IPlace } from "@/types/place.types";

type TSavedTab = "businesses" | "places" | "events" | "best-of";

export default function SavedScreen() {
  const [tab, setTab] = useState<TSavedTab>("businesses");
  const businesses = useSavedItemsStore((s) => s.businesses);
  const places = useSavedItemsStore((s) => s.places);
  const events = useSavedItemsStore((s) => s.events);
  const bestOf = useSavedItemsStore((s) => s["best-of"]);

  const ids =
    tab === "businesses"
      ? businesses
      : tab === "places"
        ? places
        : tab === "events"
          ? events
          : bestOf;

  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["saved-item", tab, id],
      queryFn: async () => {
        if (tab === "businesses") return getBusinessById(id);
        if (tab === "places") return getPlaceById(id);
        if (tab === "events") return getEventById(id);
        return getBestOfById(id);
      },
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const items = queries
    .map((q, index) => ({ data: q.data, id: ids[index] }))
    .filter((row) => row.data != null);

  return (
    <Screen title="Saved" subtitle="محفوظ شدہ" showBack>
      <View className="px-4 pb-2">
        <FlatList
          horizontal
          data={[
            { key: "businesses" as const, label: "Businesses" },
            { key: "places" as const, label: "Places" },
            { key: "events" as const, label: "Events" },
            { key: "best-of" as const, label: "Ka Best" },
          ]}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryChip
              label={item.label}
              isActive={tab === item.key}
              onPress={() => setTab(item.key)}
            />
          )}
        />
      </View>

      {isLoading ? (
        <LoadingBlock />
      ) : items.length === 0 ? (
        <EmptyState
          title="Nothing saved"
          description="Tap the bookmark on listings to save them here."
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => `${tab}-${item.id}`}
          contentContainerClassName="gap-3 px-4 pb-10"
          renderItem={({ item }) => {
            if (tab === "businesses") {
              return <BusinessCard business={item.data as IBusiness} />;
            }
            if (tab === "places") {
              return <PlaceCard place={item.data as IPlace} />;
            }
            if (tab === "events") {
              return <EventCard event={item.data as IEvent} />;
            }
            return (
              <BestOfCard listing={item.data as IBestOfListing} variant="vertical" />
            );
          }}
        />
      )}
    </Screen>
  );
}
