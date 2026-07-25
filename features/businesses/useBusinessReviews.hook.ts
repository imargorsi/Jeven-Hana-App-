import { useAuth } from "@clerk/expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

import { useMe } from "@/features/auth/useMe.hook";
import { useRequireAuth } from "@/features/auth/useRequireAuth.hook";
import { canManageReview } from "@/features/businesses/reviewOwnership.utils";
import { getApiErrorMessage } from "@/lib/apiError.utils";
import {
  createBusinessReview,
  deleteBusinessReview,
  getBusinessReviews,
  updateBusinessReview,
  type IReviewWriteInput,
} from "@/lib/services/reviews.service";
import type { IReview } from "@/types/common.types";

function applyBusinessAggregates(
  queryClient: ReturnType<typeof useQueryClient>,
  businessId: string,
  ratingAvg: number,
  reviewCount: number,
) {
  queryClient.setQueryData(["business", businessId], (prev: unknown) => {
    if (!prev || typeof prev !== "object") return prev;
    return {
      ...prev,
      rating: ratingAvg,
      reviewCount,
    };
  });
  void queryClient.invalidateQueries({ queryKey: ["businesses"] });
  void queryClient.invalidateQueries({ queryKey: ["business", businessId] });
}

export function useBusinessReviews(businessId: string | undefined) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const meQuery = useMe();
  const { requireAuth } = useRequireAuth();

  const reviewsQuery = useQuery({
    queryKey: ["business-reviews", businessId],
    queryFn: () => getBusinessReviews(businessId as string, getToken),
    enabled: Boolean(businessId),
  });

  const createMutation = useMutation({
    mutationFn: (input: IReviewWriteInput) =>
      createBusinessReview(businessId as string, input, getToken),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({
        queryKey: ["business-reviews", businessId],
      });
      if (businessId) {
        applyBusinessAggregates(
          queryClient,
          businessId,
          result.ratingAvg,
          result.reviewCount,
        );
      }
    },
    onError: (error) => {
      Alert.alert("Could Not Post Review", getApiErrorMessage(error));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      reviewId,
      input,
    }: {
      reviewId: string;
      input: Partial<IReviewWriteInput>;
    }) => updateBusinessReview(reviewId, input, getToken),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({
        queryKey: ["business-reviews", businessId],
      });
      if (businessId) {
        applyBusinessAggregates(
          queryClient,
          businessId,
          result.ratingAvg,
          result.reviewCount,
        );
      }
    },
    onError: (error) => {
      Alert.alert("Could Not Update Review", getApiErrorMessage(error));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (reviewId: string) =>
      deleteBusinessReview(reviewId, getToken),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({
        queryKey: ["business-reviews", businessId],
      });
      applyBusinessAggregates(
        queryClient,
        result.businessId,
        result.ratingAvg,
        result.reviewCount,
      );
    },
    onError: (error) => {
      Alert.alert("Could Not Delete Review", getApiErrorMessage(error));
    },
  });

  const myReview =
    reviewsQuery.data?.find(
      (review) =>
        meQuery.data?.id != null &&
        review.createdByUserId === meQuery.data.id,
    ) ?? null;

  const canManage = (review: IReview) =>
    canManageReview(meQuery.data, review);

  const confirmDelete = (review: IReview) => {
    Alert.alert(
      "Delete Review",
      "Remove this review? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteMutation.mutate(review.id),
        },
      ],
    );
  };

  return {
    reviews: reviewsQuery.data ?? [],
    isLoading: reviewsQuery.isLoading,
    isError: reviewsQuery.isError,
    refetch: reviewsQuery.refetch,
    myReview,
    canManage,
    requireAuth,
    createReview: async (input: IReviewWriteInput) => {
      const allowed = requireAuth();
      if (!allowed) return false;
      try {
        await createMutation.mutateAsync(input);
        return true;
      } catch {
        return false;
      }
    },
    updateReview: async (
      reviewId: string,
      input: Partial<IReviewWriteInput>,
    ) => {
      const allowed = requireAuth();
      if (!allowed) return false;
      try {
        await updateMutation.mutateAsync({ reviewId, input });
        return true;
      } catch {
        return false;
      }
    },
    confirmDelete,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    deletingId: deleteMutation.isPending
      ? (deleteMutation.variables as string | undefined)
      : undefined,
  };
}
