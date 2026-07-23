import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { groupEventsBySection } from "@/features/events/event.sections.utils";
import {
  getEvents,
  toggleEventInterested,
} from "@/lib/services/events.service";

export function useEventsBySection() {
  const queryClient = useQueryClient();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const eventsQuery = useQuery({
    queryKey: ["events", "upcoming-sections"],
    queryFn: () => getEvents({ upcomingOnly: true, limit: 60 }),
  });

  const sections = useMemo(
    () => groupEventsBySection(eventsQuery.data?.items ?? []),
    [eventsQuery.data?.items],
  );

  const interestedMutation = useMutation({
    mutationFn: (id: string) => toggleEventInterested(id),
    onMutate: (id) => {
      setTogglingId(id);
    },
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: ["events"] });
      void queryClient.invalidateQueries({ queryKey: ["home-events"] });
      void queryClient.invalidateQueries({ queryKey: ["event", id] });
    },
    onSettled: () => {
      setTogglingId(null);
    },
  });

  return {
    sections,
    isLoading: eventsQuery.isLoading,
    isError: eventsQuery.isError,
    isRefetching: eventsQuery.isRefetching,
    refetch: eventsQuery.refetch,
    togglingId,
    toggleInterested: (id: string) => interestedMutation.mutate(id),
  };
}
