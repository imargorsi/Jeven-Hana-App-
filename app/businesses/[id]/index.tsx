import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { ScrollView, View } from "react-native";

import { BusinessReviewList } from "@/components/BusinessReviewList";
import { ContactActions } from "@/components/ContactActions";
import { ListingHero } from "@/components/ListingHero";
import {
  ErrorState,
  FeaturedIcon,
  LoadingBlock,
  RatingDisplay,
  Screen,
  Text,
} from "@/components/ui";
import { palette } from "@/constants/Colors";
import { getBusinessOpenStatus } from "@/features/businesses/business.utils";
import { BusinessManageActions } from "@/features/businesses/components/BusinessManageActions";
import { useBusinessDetail } from "@/features/businesses/useBusinessDetail.hook";
import { useBusinessManage } from "@/features/businesses/useBusinessManage.hook";
import { shareAppLink } from "@/lib/linking.utils";
import { href } from "@/lib/navigation.utils";
import { getBusinessCategoryLabel } from "@/lib/services/businesses.service";

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { business, isLoading, isError, refetch } = useBusinessDetail(id);
  const { canManage, openEdit, confirmDelete, deletingId } =
    useBusinessManage();

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

  const categoryLabel = getBusinessCategoryLabel(business.category);
  const openStatus = getBusinessOpenStatus(business.hours);
  const sharePath = `/businesses/${business.id}`;
  const showManage = canManage(business);

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
          onShare={() => void shareAppLink(sharePath, business.name)}
        />

        <View className="px-4 pt-2">
          <View className="min-w-0 flex-row items-center gap-2">
            <Text variant="h2" className="shrink" numberOfLines={2}>
              {business.name}
            </Text>
            {business.isFeatured ? <FeaturedIcon size={22} /> : null}
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
            <Text variant="caption" tone="muted">
              {categoryLabel}
            </Text>
            {openStatus.hasHours ? (
              <>
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
              </>
            ) : null}
          </View>

          <ContactActions
            className="mt-5"
            phone={business.phone ?? undefined}
            whatsapp={business.whatsapp ?? undefined}
            label={business.name}
            onShare={() => void shareAppLink(sharePath, business.name)}
          />

          {showManage ? (
            <BusinessManageActions
              className="mt-3"
              isDeleting={deletingId === business.id}
              onEdit={() => openEdit(business.id)}
              onDelete={() =>
                confirmDelete(business, {
                  onDeleted: () => {
                    if (router.canGoBack()) {
                      router.back();
                    } else {
                      router.replace(href("/(tabs)/explore"));
                    }
                  },
                })
              }
            />
          ) : null}

          {business.description ? (
            <View className="mt-8">
              <Text variant="h3" className="mb-2">
                About
              </Text>
              <Text variant="bodySmall" tone="muted" className="leading-6">
                {business.description}
              </Text>
            </View>
          ) : null}

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
                {business.address}
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

            <View className="mb-4 rounded-card border border-dashed border-cream/15 bg-surface/50 px-4 py-5">
              <Text variant="bodySmall" weight="medium" className="text-center">
                Writing reviews comes in part 2
              </Text>
              <Text
                variant="caption"
                tone="muted"
                className="mt-1.5 text-center"
              >
                Ratings stay ready on each listing until then.
              </Text>
            </View>

            <BusinessReviewList reviews={business.reviews} />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
