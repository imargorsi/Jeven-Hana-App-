import { useQuery } from "@tanstack/react-query";

import { getBusinessById } from "@/lib/services/businesses.service";

export function useBusinessDetail(id: string | undefined) {
  const query = useQuery({
    queryKey: ["business", id],
    queryFn: () => getBusinessById(id as string),
    enabled: Boolean(id),
  });

  return {
    business: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError || (!query.isLoading && !query.data),
    refetch: query.refetch,
  };
}
