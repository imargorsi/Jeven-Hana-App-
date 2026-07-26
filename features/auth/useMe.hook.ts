import { useAuth } from "@clerk/expo";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { isApiConfigured } from "@/lib/api.client";
import { fetchMe } from "@/lib/services/auth.service";

export const meQueryKey = ["auth", "me"] as const;

/**
 * Loads / syncs the local API user for the signed-in Clerk session.
 */
export function useMe() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const enabled = Boolean(isLoaded && isSignedIn && isApiConfigured());

  return useQuery({
    queryKey: meQueryKey,
    queryFn: () => fetchMe(getToken),
    enabled,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}

export function useInvalidateMe() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: meQueryKey });
}
