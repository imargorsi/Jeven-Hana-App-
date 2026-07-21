import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

import { ImageGallery } from "@/components/ImageGallery";
import {
  ErrorState,
  LoadingBlock,
  RankBadge,
  RatingDisplay,
  SaveButton,
  Screen,
  ShareButton,
  Text,
} from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { shareContent } from "@/lib/linking.utils";
import { href } from "@/lib/navigation.utils";
import { getBestOfById } from "@/lib/services/best-of.service";

export default function BestOfDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const query = useQuery({
    queryKey: ["best-of", id],
    queryFn: () => getBestOfById(id),
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

  const listing = query.data;

  return (
    <Screen withSafeArea={false}>
      <Stack.Screen
        options={{
          title: listing.title,
          headerRight: () => (
            <View className="flex-row items-center gap-1 pr-1">
              <SaveButton type="best-of" id={listing.id} />
              <ShareButton
                onPress={() =>
                  void shareContent(
                    `${listing.title} — #${listing.rank} in Jevan Hana Ka Best`,
                  )
                }
              />
            </View>
          ),
        }}
      />
      <ScrollView contentContainerClassName="pb-10">
        <View>
          <ImageGallery urls={listing.imageUrls} />
          <RankBadge rank={listing.rank} className="absolute left-4 top-4" />
        </View>
        <View className="px-4 pt-4">
          <Text variant="h2">{listing.title}</Text>
          {listing.titleUrdu ? (
            <Text variant="body" tone="muted" isUrdu className="mt-1">
              {listing.titleUrdu}
            </Text>
          ) : null}
          <Text variant="bodySmall" tone="muted" className="mt-2">
            {listing.subtitle}
          </Text>
          <RatingDisplay rating={listing.rating} size="md" className="mt-3" />
          <Text variant="body" className="mt-4">
            “{listing.reviewSnippet}”
          </Text>
          <Button
            className="mt-6"
            onPress={() => {
              if (listing.linkedType === "business") {
                router.push(href(`/businesses/${listing.linkedId}`));
              } else {
                router.push(href(`/places/${listing.linkedId}`));
              }
            }}
          >
            View details
          </Button>
        </View>
      </ScrollView>
    </Screen>
  );
}
