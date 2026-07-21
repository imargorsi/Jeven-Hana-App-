import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";

import { ContactActions } from "@/components/ContactActions";
import { ImageGallery } from "@/components/ImageGallery";
import {
  Button,
  ErrorState,
  LoadingBlock,
  SaveButton,
  Screen,
  ShareButton,
  Text,
} from "@/components/ui";
import { formatEventDate } from "@/lib/formatter.utils";
import { shareContent } from "@/lib/linking.utils";
import {
  getEventById,
  toggleEventInterested,
} from "@/lib/services/events.service";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventById(id),
    enabled: Boolean(id),
  });

  const interestedMutation = useMutation({
    mutationFn: () => toggleEventInterested(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["event", id] });
      void queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  if (query.isLoading) {
    return (
      <Screen withSafeArea={false}>
        <LoadingBlock />
      </Screen>
    );
  }

  if (query.isError || !query.data) {
    return (
      <Screen withSafeArea={false} className="px-4">
        <ErrorState onRetry={() => void query.refetch()} />
      </Screen>
    );
  }

  const event = query.data;

  return (
    <Screen withSafeArea={false}>
      <Stack.Screen
        options={{
          title: event.title,
          headerRight: () => (
            <View className="flex-row items-center gap-1 pr-1">
              <SaveButton type="event" id={event.id} />
              <ShareButton
                onPress={() =>
                  void shareContent(
                    `${event.title} — ${formatEventDate(event.startsAt)}`,
                  )
                }
              />
            </View>
          ),
        }}
      />
      <ScrollView contentContainerClassName="pb-10">
        <ImageGallery urls={event.imageUrls} />
        <View className="px-4 pt-4">
          <Text variant="h2">{event.title}</Text>
          {event.titleUrdu ? (
            <Text variant="body" tone="muted" isUrdu className="mt-1">
              {event.titleUrdu}
            </Text>
          ) : null}
          <Text variant="bodySmall" tone="primary" className="mt-3">
            {formatEventDate(event.startsAt)}
          </Text>
          <Text variant="caption" tone="muted" className="mt-1">
            Until {formatEventDate(event.endsAt)}
          </Text>
          <Text variant="body" className="mt-4">
            {event.description}
          </Text>

          <Text variant="h3" className="mb-2 mt-6">
            Location
          </Text>
          <Text variant="bodySmall">{event.location.address}</Text>

          <ContactActions
            className="mt-4"
            phone={event.organizerContact}
            lat={event.location.lat}
            lng={event.location.lng}
            label={event.title}
          />

          <Text variant="h3" className="mb-2 mt-6">
            Organizer
          </Text>
          <Text variant="bodySmall">{event.organizerName}</Text>
          <Text variant="caption" tone="muted" className="mt-1">
            {event.interestedCount} interested
          </Text>

          <Button
            className="mt-6"
            variant={event.isInterestedByMe ? "secondary" : "primary"}
            isLoading={interestedMutation.isPending}
            onPress={() => interestedMutation.mutate()}
          >
            {event.isInterestedByMe ? "Interested ✓" : "I'm interested"}
          </Button>
        </View>
      </ScrollView>
    </Screen>
  );
}
