import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FlatList, View } from "react-native";

import { EventCard } from "@/components/EventCard";
import { EmptyState, ErrorState, LoadingBlock, Screen } from "@/components/ui";
import {
  getGoingEvents,
  toggleEventInterested,
} from "@/lib/services/events.service";

export default function EventsGoingScreen() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["events-going"],
    queryFn: getGoingEvents,
  });

  const interestedMutation = useMutation({
    mutationFn: toggleEventInterested,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["events-going"] });
      void queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  if (query.isLoading) {
    return (
      <Screen withSafeArea={false} withAppHeader={false}>
        <LoadingBlock />
      </Screen>
    );
  }

  if (query.isError) {
    return (
      <Screen withSafeArea={false} withAppHeader={false} className="px-4">
        <ErrorState onRetry={() => void query.refetch()} />
      </Screen>
    );
  }

  return (
    <Screen withSafeArea={false} withAppHeader={false}>
      <FlatList
        data={query.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-3.5 px-4 pb-10 pt-2"
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onToggleInterested={() => interestedMutation.mutate(item.id)}
            isToggling={
              interestedMutation.isPending &&
              interestedMutation.variables === item.id
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No events yet"
            description="Tap Going on an event to keep it here."
          />
        }
        ItemSeparatorComponent={() => <View className="h-0" />}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}
