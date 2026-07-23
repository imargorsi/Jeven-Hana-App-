import { RefreshControl, ScrollView, View } from "react-native";

import { EventCard } from "@/components/EventCard";
import {
  EmptyState,
  ErrorState,
  LoadingBlock,
  Screen,
  Text,
} from "@/components/ui";
import { useEventsBySection } from "@/features/events/useEventsBySection.hook";

export default function EventsTabScreen() {
  const {
    sections,
    isLoading,
    isError,
    isRefetching,
    refetch,
    togglingId,
    toggleInterested,
  } = useEventsBySection();

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

  const hasEvents = sections.some((section) => section.events.length > 0);

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-14 pt-3"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => void refetch()}
          />
        }
      >
        {!hasEvents ? (
          <EmptyState
            title="No upcoming events"
            description="Check back soon for neighbourhood gatherings."
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
