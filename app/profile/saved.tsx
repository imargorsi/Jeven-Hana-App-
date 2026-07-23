import { useQueries } from "@tanstack/react-query";
import { FlatList, View } from "react-native";

import { BestOfCard } from "@/components/BestOfCard";
import { BusinessCard } from "@/components/BusinessCard";
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

type TSavedKind = "business" | "place" | "event" | "best-of";

interface ISavedRef {
  kind: TSavedKind;
  id: string;
}

type TSavedRow =
  | { kind: "business"; id: string; data: IBusiness }
  | { kind: "place"; id: string; data: IPlace }
  | { kind: "event"; id: string; data: IEvent }
  | { kind: "best-of"; id: string; data: IBestOfListing };

export default function SavedPlacesScreen() {
  const businesses = useSavedItemsStore((s) => s.businesses);
  const places = useSavedItemsStore((s) => s.places);
  const events = useSavedItemsStore((s) => s.events);
  const bestOf = useSavedItemsStore((s) => s["best-of"]);

  const refs: ISavedRef[] = [
    ...businesses.map((id) => ({ kind: "business" as const, id })),
    ...places.map((id) => ({ kind: "place" as const, id })),
    ...events.map((id) => ({ kind: "event" as const, id })),
    ...bestOf.map((id) => ({ kind: "best-of" as const, id })),
  ];

  const queries = useQueries({
    queries: refs.map((ref) => ({
      queryKey: ["saved-item", ref.kind, ref.id],
      queryFn: async () => {
        if (ref.kind === "business") return getBusinessById(ref.id);
        if (ref.kind === "place") return getPlaceById(ref.id);
        if (ref.kind === "event") return getEventById(ref.id);
        return getBestOfById(ref.id);
      },
    })),
  });

  const isLoading = refs.length > 0 && queries.some((q) => q.isLoading);
  const items: TSavedRow[] = queries
    .map((q, index) => {
      const ref = refs[index];
      if (!ref || q.data == null) return null;
      return { kind: ref.kind, id: ref.id, data: q.data } as TSavedRow;
    })
    .filter((row): row is TSavedRow => row != null);

  if (isLoading) {
    return (
      <Screen withSafeArea={false} withAppHeader={false}>
        <LoadingBlock />
      </Screen>
    );
  }

  return (
    <Screen withSafeArea={false} withAppHeader={false}>
      <FlatList
        data={items}
        keyExtractor={(item) => `${item.kind}-${item.id}`}
        contentContainerClassName="gap-3.5 px-4 pb-10 pt-2"
        renderItem={({ item }) => {
          if (item.kind === "business") {
            return <BusinessCard business={item.data} />;
          }
          if (item.kind === "place") {
            return <PlaceCard place={item.data} />;
          }
          if (item.kind === "event") {
            return <EventCard event={item.data} />;
          }
          return <BestOfCard listing={item.data} variant="vertical" />;
        }}
        ListEmptyComponent={
          <EmptyState
            title="Nothing saved"
            description="Bookmark businesses, places, or Ka Best to see them here."
          />
        }
        ItemSeparatorComponent={() => <View className="h-0" />}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}
