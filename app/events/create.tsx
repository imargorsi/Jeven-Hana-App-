import { useAuth } from "@clerk/expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { Screen } from "@/components/ui";
import { EventForm } from "@/features/events/components/EventForm";
import {
  buildEventPayload,
  emptyEventFormValues,
  type IEventFormValues,
} from "@/features/events/eventForm.utils";
import { invalidateEventQueries } from "@/features/events/useEventManage.hook";
import { getApiErrorMessage } from "@/lib/apiError.utils";
import { createEvent } from "@/lib/services/events.service";

export default function CreateEventScreen() {
  const { getToken } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<IEventFormValues>(emptyEventFormValues);

  const mutation = useMutation({
    mutationFn: () => {
      const result = buildEventPayload(values);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return createEvent(result.payload, getToken);
    },
    onSuccess: () => {
      invalidateEventQueries(queryClient);
      router.back();
    },
    onError: (error) => {
      Alert.alert("Could not create", getApiErrorMessage(error));
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
    <Screen withSafeArea={false} withAppHeader={false}>
      <EventForm
        values={values}
        onChange={(patch) => setValues((prev) => ({ ...prev, ...patch }))}
        onSubmit={onSubmit}
        isSubmitting={mutation.isPending}
        submitLabel="Create Event"
      />
    </Screen>
  );
}
