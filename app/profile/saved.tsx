import { useAuth } from "@clerk/expo";
import { useQueries } from "@tanstack/react-query";
import { FlatList, View } from "react-native";

import { BusinessCard } from "@/components/BusinessCard";
import { EventCard } from "@/components/EventCard";
import { EmptyState, LoadingBlock, Screen } from "@/components/ui";
import { getBusinessById } from "@/lib/services/businesses.service";
import { getEventById } from "@/lib/services/events.service";
import { useSavedItemsStore } from "@/stores/useSavedItemsStore";
import type { IBusiness } from "@/types/business.types";
import type { IEvent } from "@/types/event.types";

type TSavedKind = "business" | "event";

interface ISavedRef {
  kind: TSavedKind;
  id: string;
}

type TSavedRow =
  | { kind: "business"; id: string; data: IBusiness }
  | { kind: "event"; id: string; data: IEvent };

export default function SavedPlacesScreen() {
  const { getToken, userId } = useAuth();
  const businesses = useSavedItemsStore((s) => s.businesses);
  const events = useSavedItemsStore((s) => s.events);

  // Places are folded into Business in part 1 — only businesses + events.
  const refs: ISavedRef[] = [
    ...businesses.map((id) => ({ kind: "business" as const, id })),
    ...events.map((id) => ({ kind: "event" as const, id })),
  ];

  const queries = useQueries({
    queries: refs.map((ref) => ({
      queryKey: ["saved-item", userId, ref.kind, ref.id],
      enabled: Boolean(userId),
      queryFn: async () => {
        if (ref.kind === "business") return getBusinessById(ref.id);
        return getEventById(ref.id, getToken);
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
          return <EventCard event={item.data} />;
        }}
        ListEmptyComponent={
          <EmptyState
            title="Nothing Saved"
            description="Bookmark businesses or events to see them here."
          />
        }
        ItemSeparatorComponent={() => <View className="h-0" />}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}
