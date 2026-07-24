import { useAuth } from "@clerk/expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Alert } from "react-native";

import { groupEventsBySection } from "@/features/events/event.sections.utils";
import { getApiErrorMessage } from "@/lib/apiError.utils";
import {
  getEvents,
  toggleEventGoing,
} from "@/lib/services/events.service";

export function useEventsBySection() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const eventsQuery = useQuery({
    queryKey: ["events", "upcoming-sections"],
    queryFn: () => getEvents(getToken),
  });

  const sections = useMemo(
    () => groupEventsBySection(eventsQuery.data ?? []),
    [eventsQuery.data],
  );

  const goingMutation = useMutation({
    mutationFn: (id: string) => toggleEventGoing(id, getToken),
    onMutate: (id) => {
      setTogglingId(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["events"] });
      void queryClient.invalidateQueries({ queryKey: ["events-going"] });
    },
    onError: (error) => {
      Alert.alert("Could not update", getApiErrorMessage(error));
    },
    onSettled: () => {
      setTogglingId(null);
    },
  });

  return {
    sections,
    isLoading: eventsQuery.isLoading,
    isError: eventsQuery.isError,
    errorMessage: eventsQuery.error
      ? getApiErrorMessage(eventsQuery.error)
      : undefined,
    isRefetching: eventsQuery.isRefetching,
    refetch: eventsQuery.refetch,
    togglingId,
    toggleInterested: (id: string) => goingMutation.mutate(id),
  };
}
