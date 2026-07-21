import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";

import { ContactActions } from "@/components/ContactActions";
import { ImageGallery } from "@/components/ImageGallery";
import {
  ErrorState,
  LoadingBlock,
  RatingDisplay,
  SaveButton,
  Screen,
  ShareButton,
  Text,
} from "@/components/ui";
import { formatShortDate } from "@/lib/formatter.utils";
import { shareContent } from "@/lib/linking.utils";
import { getBusinessById } from "@/lib/services/businesses.service";

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const query = useQuery({
    queryKey: ["business", id],
    queryFn: () => getBusinessById(id),
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

  const business = query.data;

  return (
    <Screen withSafeArea={false}>
      <Stack.Screen
        options={{
          title: business.name,
          headerRight: () => (
            <View className="flex-row items-center gap-1 pr-1">
              <SaveButton type="business" id={business.id} />
              <ShareButton
                onPress={() =>
                  void shareContent(
                    `${business.name} — ${business.location.address}`,
                  )
                }
              />
            </View>
          ),
        }}
      />
      <ScrollView contentContainerClassName="pb-10">
        <ImageGallery urls={business.imageUrls} />
        <View className="px-4 pt-4">
          <Text variant="h2">{business.name}</Text>
          {business.nameUrdu ? (
            <Text variant="body" tone="muted" isUrdu className="mt-1">
              {business.nameUrdu}
            </Text>
          ) : null}
          <RatingDisplay
            rating={business.rating}
            reviewCount={business.reviewCount}
            size="md"
            className="mt-2"
          />
          <Text variant="body" className="mt-4">
            {business.description}
          </Text>
          <Text variant="caption" tone="muted" className="mt-2">
            {business.location.address}
          </Text>

          <ContactActions
            className="mt-5"
            phone={business.phone}
            whatsapp={business.whatsapp}
            lat={business.location.lat}
            lng={business.location.lng}
            label={business.name}
          />

          <Text variant="h3" className="mb-3 mt-8">
            Opening hours
          </Text>
          <View className="gap-2 rounded-card border border-cream/10 bg-surface p-4">
            {business.hours.map((h) => (
              <View key={h.day} className="flex-row justify-between">
                <Text variant="bodySmall">{h.day}</Text>
                <Text variant="bodySmall" tone="muted">
                  {h.isClosed ? "Closed" : `${h.open} – ${h.close}`}
                </Text>
              </View>
            ))}
          </View>

          <Text variant="h3" className="mb-3 mt-8">
            Ratings & reviews
          </Text>
          {business.reviews.length === 0 ? (
            <Text tone="muted">No reviews yet.</Text>
          ) : (
            <View className="gap-3">
              {business.reviews.map((review) => (
                <View
                  key={review.id}
                  className="rounded-card border border-cream/10 bg-surface p-4"
                >
                  <View className="mb-1 flex-row items-center justify-between">
                    <Text variant="bodySmall" weight="semibold">
                      {review.authorName}
                    </Text>
                    <RatingDisplay rating={review.rating} />
                  </View>
                  <Text variant="bodySmall">{review.comment}</Text>
                  <Text variant="caption" tone="muted" className="mt-2">
                    {formatShortDate(review.createdAt)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
