import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addBusinessReview,
  getBusinessById,
} from "@/lib/services/businesses.service";

export function useBusinessDetail(id: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["business", id],
    queryFn: () => getBusinessById(id as string),
    enabled: Boolean(id),
  });

  const reviewMutation = useMutation({
    mutationFn: (input: { rating: number; comment: string }) =>
      addBusinessReview(id as string, {
        authorName: "Neighbour",
        rating: input.rating,
        comment: input.comment,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["business", id] });
      void queryClient.invalidateQueries({ queryKey: ["explore-businesses"] });
      void queryClient.invalidateQueries({
        queryKey: ["home-nearby-highlights"],
      });
    },
  });

  return {
    business: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError || (!query.isLoading && !query.data),
    refetch: query.refetch,
    submitReview: reviewMutation.mutate,
    isSubmittingReview: reviewMutation.isPending,
  };
}
