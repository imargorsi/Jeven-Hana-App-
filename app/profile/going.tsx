import { useAuth } from "@clerk/expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, FlatList, View } from "react-native";

import { EventCard } from "@/components/EventCard";
import { EmptyState, ErrorState, LoadingBlock, Screen } from "@/components/ui";
import { useEventManage } from "@/features/events/useEventManage.hook";
import { getApiErrorMessage } from "@/lib/apiError.utils";
import {
  getGoingEvents,
  toggleEventGoing,
} from "@/lib/services/events.service";

export default function EventsGoingScreen() {
  const { getToken, userId } = useAuth();
  const queryClient = useQueryClient();
  const { canManage, openEdit, confirmDelete, deletingId } = useEventManage();

  const query = useQuery({
    queryKey: ["events-going", userId],
    queryFn: () => getGoingEvents(getToken),
    enabled: Boolean(userId),
  });

  const goingMutation = useMutation({
    mutationFn: (id: string) => toggleEventGoing(id, getToken),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["events-going", userId] });
      void queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error) => {
      Alert.alert("Could not update", getApiErrorMessage(error));
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
        <ErrorState
          description={getApiErrorMessage(query.error)}
          onRetry={() => void query.refetch()}
        />
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
            onToggleInterested={() => goingMutation.mutate(item.id)}
            isToggling={
              goingMutation.isPending && goingMutation.variables === item.id
            }
            canManage={canManage(item)}
            onEdit={() => openEdit(item.id)}
            onDelete={() => confirmDelete(item)}
            isDeleting={deletingId === item.id}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No Events Yet"
            description="Tap Going on an event to keep it here."
          />
        }
        ItemSeparatorComponent={() => <View className="h-0" />}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}
