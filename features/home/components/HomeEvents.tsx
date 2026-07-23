import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { HomeEventCard } from "@/components/HomeEventCard";
import { ErrorState, LoadingBlock, SectionHeader } from "@/components/ui";
import { HomeSectionEmpty } from "@/features/home/components/HomeSectionEmpty";
import { cn } from "@/lib/cn.utils";
import { href } from "@/lib/navigation.utils";
import {
  getEvents,
  toggleEventInterested,
} from "@/lib/services/events.service";

const EVENT_LIMIT = 3;

interface IHomeEventsProps {
  className?: string;
}

export function HomeEvents({ className }: IHomeEventsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const eventsQuery = useQuery({
    queryKey: ["home-events"],
    queryFn: () => getEvents({ upcomingOnly: true, limit: EVENT_LIMIT }),
  });

  const interestedMutation = useMutation({
    mutationFn: (id: string) => toggleEventInterested(id),
    onMutate: (id) => {
      setTogglingId(id);
    },
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: ["home-events"] });
      void queryClient.invalidateQueries({ queryKey: ["events"] });
      void queryClient.invalidateQueries({ queryKey: ["event", id] });
    },
    onSettled: () => {
      setTogglingId(null);
    },
  });

  const events = eventsQuery.data?.items ?? [];

  if (eventsQuery.isLoading) {
    return (
      <View className={cn("mb-6", className)}>
        <SectionHeader title="Upcoming Events" />
        <LoadingBlock className="py-10" />
      </View>
    );
  }

  if (eventsQuery.isError) {
    return (
      <View className={cn("mb-6", className)}>
        <SectionHeader title="Upcoming Events" />
        <ErrorState
          className="px-2 py-8"
          onRetry={() => void eventsQuery.refetch()}
        />
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View className={cn("mb-6", className)}>
        <SectionHeader
          title="Upcoming Events"
          actionLabel="View All"
          onActionPress={() => router.push(href("/(tabs)/events"))}
        />
        <HomeSectionEmpty message="No upcoming events right now." />
      </View>
    );
  }

  return (
    <View className={cn("mb-6", className)}>
      <SectionHeader
        title="Upcoming Events"
        actionLabel="View All"
        onActionPress={() => router.push(href("/(tabs)/events"))}
      />

      <View className="gap-3">
        {events.map((event) => (
          <HomeEventCard
            key={event.id}
            event={event}
            isToggling={togglingId === event.id}
            onToggleInterested={() => interestedMutation.mutate(event.id)}
          />
        ))}
      </View>
    </View>
  );
}
