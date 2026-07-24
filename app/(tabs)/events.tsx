import { RefreshControl, ScrollView, View } from "react-native";

import { EventCard } from "@/components/EventCard";
import {
  EmptyState,
  ErrorState,
  LoadingBlock,
  Screen,
  Text,
} from "@/components/ui";
import { CreateEventActionCard } from "@/features/events/components/CreateEventActionCard";
import { useEventManage } from "@/features/events/useEventManage.hook";
import { useEventsBySection } from "@/features/events/useEventsBySection.hook";

export default function EventsTabScreen() {
  const {
    sections,
    isLoading,
    isError,
    errorMessage,
    isRefetching,
    refetch,
    togglingId,
    toggleInterested,
  } = useEventsBySection();
  const { canManage, openCreate, openEdit, confirmDelete, deletingId } =
    useEventManage();

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
        <ErrorState
          description={errorMessage}
          onRetry={() => void refetch()}
        />
      </Screen>
    );
  }

  const hasEvents = sections.some((section) => section.events.length > 0);

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-10 pt-3"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => void refetch()}
          />
        }
      >
        <CreateEventActionCard onPress={openCreate} />

        {!hasEvents ? (
          <EmptyState
            title="No Upcoming Events"
            description="Create an event to share something with the neighbourhood."
          />
        ) : (
          sections.map((section) => (
            <View key={section.key} className="mb-7">
              <Text variant="label" tone="primary" className="mb-3">
                {section.title}
              </Text>
              <View className="gap-3">
                {section.events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isToggling={togglingId === event.id}
                    onToggleInterested={() => toggleInterested(event.id)}
                    canManage={canManage(event)}
                    onEdit={() => openEdit(event.id)}
                    onDelete={() => confirmDelete(event)}
                    isDeleting={deletingId === event.id}
                  />
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}
