import { useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { ScrollView, View } from "react-native";

import { BusinessReviewForm } from "@/components/BusinessReviewForm";
import { BusinessReviewList } from "@/components/BusinessReviewList";
import { ContactActions } from "@/components/ContactActions";
import { ListingHero } from "@/components/ListingHero";
import {
  ErrorState,
  KaBestBadge,
  LoadingBlock,
  RatingDisplay,
  Screen,
  Text,
} from "@/components/ui";
import { palette } from "@/constants/Colors";
import { getBusinessOpenStatus } from "@/features/businesses/business.utils";
import { useBusinessDetail } from "@/features/businesses/useBusinessDetail.hook";
import { shareContent } from "@/lib/linking.utils";
import { getBusinessCategoryLabel } from "@/lib/services/businesses.service";

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    business,
    isLoading,
    isError,
    refetch,
    submitReview,
    isSubmittingReview,
  } = useBusinessDetail(id);

  if (isLoading) {
    return (
      <Screen withSafeArea={false} withAppHeader={false}>
        <LoadingBlock />
      </Screen>
    );
  }

  if (isError || !business) {
    return (
      <Screen withSafeArea={false} withAppHeader={false} className="px-4">
        <ErrorState onRetry={() => void refetch()} />
      </Screen>
    );
  }

  const categoryLabel = getBusinessCategoryLabel(business.categorySlug);
  const metaLine = [categoryLabel, ...(business.tags ?? [])]
    .filter(Boolean)
    .join(" · ");
  const openStatus = getBusinessOpenStatus(business.hours);
  const shareMessage = `${business.name} — ${business.location.address}`;

  return (
    <Screen withSafeArea={false} withAppHeader={false}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-14"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ListingHero
          urls={business.imageUrls}
          saveType="business"
          saveId={business.id}
          onShare={() => void shareContent(shareMessage)}
        />

        <View className="px-4 pt-2">
          <View className="flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1 gap-2">
              <Text variant="h2" numberOfLines={2}>
                {business.name}
              </Text>
              {business.isKaBest ? <KaBestBadge size="sm" /> : null}
            </View>
            {business.nameUrdu ? (
              <Text
                variant="bodySmall"
                tone="muted"
                isUrdu
                className="shrink pt-1"
                numberOfLines={2}
              >
                {business.nameUrdu}
              </Text>
            ) : null}
          </View>

          <View className="mt-3 flex-row items-center gap-2">
            <RatingDisplay
              rating={business.rating}
              reviewCount={business.reviewCount}
              size="md"
            />
            <Text variant="caption" tone="muted">
              reviews
            </Text>
          </View>

          <View className="mt-2.5 flex-row flex-wrap items-center gap-2">
            {metaLine ? (
              <Text variant="caption" tone="muted">
                {metaLine}
              </Text>
            ) : null}
            <View
              className={
                openStatus.isOpen
                  ? "rounded-chip bg-success/15 px-2 py-0.5"
                  : "rounded-chip bg-cream/10 px-2 py-0.5"
              }
            >
              <Text
                variant="caption"
                weight="semibold"
                tone={openStatus.isOpen ? "success" : "muted"}
              >
                {openStatus.isOpen ? "Open" : "Closed"}
              </Text>
            </View>
            <Text variant="caption" tone="muted">
              {openStatus.detail}
            </Text>
          </View>

          <ContactActions
            className="mt-5"
            phone={business.phone}
            whatsapp={business.whatsapp}
            lat={business.location.lat}
            lng={business.location.lng}
            label={business.name}
            onShare={() => void shareContent(shareMessage)}
          />

          <View className="mt-8">
            <Text variant="h3" className="mb-2">
              About
            </Text>
            <Text variant="bodySmall" tone="muted" className="leading-6">
              {business.description}
            </Text>
          </View>

          <View className="mt-6 flex-row items-start gap-3 rounded-card border border-cream/10 bg-surface/60 p-3.5">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-primary/15">
              <SymbolView
                name={{
                  ios: "mappin.and.ellipse",
                  android: "location_on",
                  web: "location_on",
                }}
                size={16}
                tintColor={palette.primary}
              />
            </View>
            <View className="min-w-0 flex-1">
              <Text variant="caption" tone="muted" weight="medium">
                Address
              </Text>
              <Text variant="bodySmall" className="mt-0.5">
                {business.location.address}
              </Text>
            </View>
          </View>

          <View className="mt-8">
            <Text variant="h3" className="mb-1">
              Reviews
            </Text>
            <Text variant="caption" tone="muted" className="mb-4">
              {business.reviewCount} reviews · {business.rating.toFixed(1)}{" "}
              average
            </Text>

            <BusinessReviewForm
              className="mb-4"
              isSubmitting={isSubmittingReview}
              onSubmit={(input) => submitReview(input)}
            />

            <BusinessReviewList reviews={business.reviews} />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
