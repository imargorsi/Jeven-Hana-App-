import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";

import { ContactActions } from "@/components/ContactActions";
import { ImageGallery } from "@/components/ImageGallery";
import {
  ErrorState,
  LoadingBlock,
  SaveButton,
  Screen,
  ShareButton,
  Text,
} from "@/components/ui";
import { shareContent } from "@/lib/linking.utils";
import { getPlaceById } from "@/lib/services/places.service";

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const query = useQuery({
    queryKey: ["place", id],
    queryFn: () => getPlaceById(id),
    enabled: Boolean(id),
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

  const place = query.data;

  return (
    <Screen withSafeArea={false}>
      <Stack.Screen
        options={{
          title: place.name,
          headerRight: () => (
            <View className="flex-row items-center gap-1 pr-1">
              <SaveButton type="place" id={place.id} />
              <ShareButton
                onPress={() =>
                  void shareContent(`${place.name} — ${place.location.address}`)
                }
              />
            </View>
          ),
        }}
      />
      <ScrollView contentContainerClassName="pb-10">
        <ImageGallery urls={place.imageUrls} />
        <View className="px-4 pt-4">
          <Text variant="h2">{place.name}</Text>
          {place.nameUrdu ? (
            <Text variant="body" tone="muted" isUrdu className="mt-1">
              {place.nameUrdu}
            </Text>
          ) : null}
          <Text variant="body" className="mt-4">
            {place.description}
          </Text>
          <Text variant="caption" tone="muted" className="mt-2">
            {place.location.address}
          </Text>

          <ContactActions
            className="mt-5"
            phone={place.phone}
            lat={place.location.lat}
            lng={place.location.lng}
            label={place.name}
          />

          {place.hours && place.hours.length > 0 ? (
            <>
              <Text variant="h3" className="mb-3 mt-8">
                Opening hours
              </Text>
              <View className="gap-2 rounded-card border border-cream/10 bg-surface p-4">
                {place.hours.map((h) => (
                  <View key={h.day} className="flex-row justify-between">
                    <Text variant="bodySmall">{h.day}</Text>
                    <Text variant="bodySmall" tone="muted">
                      {h.isClosed ? "Closed" : `${h.open} – ${h.close}`}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}
