import { useAuth } from "@clerk/expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { ErrorState, LoadingBlock, Screen } from "@/components/ui";
import { useMe } from "@/features/auth/useMe.hook";
import { EventForm } from "@/features/events/components/EventForm";
import {
  buildEventPayload,
  eventToFormValues,
  type IEventFormValues,
} from "@/features/events/eventForm.utils";
import { canManageEvent } from "@/features/events/eventOwnership.utils";
import { invalidateEventQueries } from "@/features/events/useEventManage.hook";
import { getApiErrorMessage } from "@/lib/apiError.utils";
import {
  getEventById,
  updateEvent,
} from "@/lib/services/events.service";
import type { IEvent } from "@/types/event.types";

function EditEventForm({ event }: { event: IEvent }) {
  const { getToken } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<IEventFormValues>(() =>
    eventToFormValues(event),
  );

  const mutation = useMutation({
    mutationFn: () => {
      const result = buildEventPayload(values);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return updateEvent(event.id, result.payload, getToken);
    },
    onSuccess: () => {
      invalidateEventQueries(queryClient);
      void queryClient.invalidateQueries({
        queryKey: ["events", "detail", event.id],
      });
      router.back();
    },
    onError: (error) => {
      Alert.alert("Could not save", getApiErrorMessage(error));
    },
  });

  const onSubmit = () => {
    const result = buildEventPayload(values);
    if ("error" in result) {
      Alert.alert("Check details", result.error);
      return;
    }
    mutation.mutate();
  };

  return (
    <EventForm
      values={values}
      onChange={(patch) => setValues((prev) => ({ ...prev, ...patch }))}
      onSubmit={onSubmit}
      isSubmitting={mutation.isPending}
      submitLabel="Save Changes"
    />
  );
}

export default function EditEventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const eventId = typeof id === "string" ? id : id?.[0];
  const { getToken } = useAuth();
  const meQuery = useMe();

  const eventQuery = useQuery({
    queryKey: ["events", "detail", eventId],
    queryFn: () => getEventById(eventId!, getToken),
    enabled: Boolean(eventId),
  });

  if (!eventId) {
    return (
      <Screen withSafeArea={false} withAppHeader={false} className="px-4">
        <ErrorState description="Missing event id." />
      </Screen>
    );
  }

  if (eventQuery.isLoading || meQuery.isLoading) {
    return (
      <Screen withSafeArea={false} withAppHeader={false}>
        <LoadingBlock />
      </Screen>
    );
  }

  if (eventQuery.isError) {
    return (
      <Screen withSafeArea={false} withAppHeader={false} className="px-4">
        <ErrorState
          description={getApiErrorMessage(eventQuery.error)}
          onRetry={() => void eventQuery.refetch()}
        />
      </Screen>
    );
  }

  if (!eventQuery.data) {
    return (
      <Screen withSafeArea={false} withAppHeader={false} className="px-4">
        <ErrorState description="Event not found." />
      </Screen>
    );
  }

  if (!canManageEvent(meQuery.data, eventQuery.data)) {
    return (
      <Screen withSafeArea={false} withAppHeader={false} className="px-4">
        <ErrorState description="You can only edit your own events." />
      </Screen>
    );
  }

  return (
    <Screen withSafeArea={false} withAppHeader={false}>
      <EditEventForm key={eventQuery.data.id} event={eventQuery.data} />
    </Screen>
  );
}
