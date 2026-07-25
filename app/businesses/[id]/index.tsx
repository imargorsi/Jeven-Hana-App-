import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Alert, Pressable, View } from "react-native";

import { BusinessReviewList } from "@/components/BusinessReviewList";
import { ContactActions } from "@/components/ContactActions";
import { ListingHero } from "@/components/ListingHero";
import {
  Button,
  ErrorState,
  FeaturedIcon,
  KeyboardAwareScrollView,
  LoadingBlock,
  RatingDisplay,
  Screen,
  Text,
} from "@/components/ui";
import { palette } from "@/constants/Colors";
import { getBusinessOpenStatus } from "@/features/businesses/business.utils";
import {
  BusinessReviewForm,
  emptyBusinessReviewFormValues,
  type IBusinessReviewFormValues,
} from "@/features/businesses/components/BusinessReviewForm";
import { useBusinessDetail } from "@/features/businesses/useBusinessDetail.hook";
import { useBusinessManage } from "@/features/businesses/useBusinessManage.hook";
import { useBusinessReviews } from "@/features/businesses/useBusinessReviews.hook";
import { shareAppLink } from "@/lib/linking.utils";
import { href } from "@/lib/navigation.utils";
import { getBusinessCategoryLabel } from "@/lib/services/businesses.service";
import type { IReview } from "@/types/common.types";

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { business, isLoading, isError, refetch } = useBusinessDetail(id);
  const { canManage, openEdit, confirmDelete, deletingId } =
    useBusinessManage();
  const reviewsApi = useBusinessReviews(business?.id ?? id);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<IReview | null>(null);
  const [formValues, setFormValues] = useState<IBusinessReviewFormValues>(
    emptyBusinessReviewFormValues,
  );

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
  const hasMyReview = Boolean(reviewsApi.myReview);

  const openCreateForm = () => {
    reviewsApi.requireAuth(() => {
      if (reviewsApi.myReview) {
        Alert.alert(
          "Already Reviewed",
          "You already reviewed this listing. Edit your existing review instead.",
        );
        return;
      }
      setEditingReview(null);
      setFormValues(emptyBusinessReviewFormValues());
      setIsFormOpen(true);
    });
  };

  const openEditForm = (review: IReview) => {
    setEditingReview(review);
    setFormValues({
      rating: review.rating,
      comment: review.comment,
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingReview(null);
    setFormValues(emptyBusinessReviewFormValues());
  };

  const submitForm = async () => {
    const comment = formValues.comment.trim();
    if (!comment) {
      Alert.alert("Check Details", "Please write a short review.");
      return;
    }
    if (formValues.rating < 1 || formValues.rating > 5) {
      Alert.alert("Check Details", "Pick a rating from 1 to 5 stars.");
      return;
    }

    if (editingReview) {
      const ok = await reviewsApi.updateReview(editingReview.id, {
        rating: formValues.rating,
        comment,
      });
      if (ok) closeForm();
      return;
    }

    const ok = await reviewsApi.createReview({
      rating: formValues.rating,
      comment,
    });
    if (ok) closeForm();
  };

  return (
    <Screen withSafeArea={false} withAppHeader={false}>
      <KeyboardAwareScrollView contentContainerClassName="pb-14" bottomOffset={32}>
        <ListingHero
          urls={business.imageUrls}
          saveType="business"
          saveId={business.id}
          onShare={() => void shareAppLink(sharePath, business.name)}
          canManage={showManage}
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
          isDeleting={deletingId === business.id}
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
              Reviews
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
            <View className="mb-1 flex-row items-center justify-between gap-3">
              <Text variant="h3">Reviews</Text>
              {!hasMyReview && !isFormOpen ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Write Review"
                  onPress={openCreateForm}
                  className="active:opacity-80"
                >
                  <Text variant="caption" weight="semibold" tone="primary">
                    Write Review
                  </Text>
                </Pressable>
              ) : null}
            </View>
            <Text variant="caption" tone="muted" className="mb-4">
              {business.reviewCount}{" "}
              {business.reviewCount === 1 ? "review" : "reviews"} ·{" "}
              {business.rating.toFixed(1)} average
            </Text>

            {isFormOpen ? (
              <View className="mb-4">
                <BusinessReviewForm
                  values={formValues}
                  onChange={(patch) =>
                    setFormValues((prev) => ({ ...prev, ...patch }))
                  }
                  onSubmit={submitForm}
                  onCancel={closeForm}
                  isSubmitting={
                    reviewsApi.isCreating || reviewsApi.isUpdating
                  }
                  submitLabel={
                    editingReview ? "Save Changes" : "Post Review"
                  }
                />
              </View>
            ) : null}

            {reviewsApi.isLoading ? (
              <LoadingBlock className="py-8" />
            ) : reviewsApi.isError ? (
              <View className="py-2">
                <ErrorState onRetry={() => void reviewsApi.refetch()} />
              </View>
            ) : (
              <BusinessReviewList
                reviews={reviewsApi.reviews}
                canManage={reviewsApi.canManage}
                onEdit={openEditForm}
                onDelete={reviewsApi.confirmDelete}
                deletingId={reviewsApi.deletingId}
              />
            )}

            {!hasMyReview && !isFormOpen ? (
              <Button
                variant="secondary"
                size="md"
                isFullWidth
                onPress={openCreateForm}
                className="mt-4"
              >
                Write Review
              </Button>
            ) : null}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}
