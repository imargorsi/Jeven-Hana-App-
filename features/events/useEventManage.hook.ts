import { useAuth } from "@clerk/expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { useMe } from "@/features/auth/useMe.hook";
import { useRequireAuth } from "@/features/auth/useRequireAuth.hook";
import { canManageEvent } from "@/features/events/eventOwnership.utils";
import { getApiErrorMessage } from "@/lib/apiError.utils";
import { href } from "@/lib/navigation.utils";
import { deleteEvent } from "@/lib/services/events.service";
import type { IEvent } from "@/types/event.types";

function invalidateEventQueries(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: ["events"] });
  void queryClient.invalidateQueries({ queryKey: ["events-going"] });
  void queryClient.invalidateQueries({ queryKey: ["search"] });
}

/** Create / edit navigation + owner/admin delete for event cards. */
export function useEventManage() {
  const { getToken } = useAuth();
  const meQuery = useMe();
  const { requireAuth } = useRequireAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEvent(id, getToken),
    onMutate: (id) => {
      setDeletingId(id);
    },
    onSuccess: () => {
      invalidateEventQueries(queryClient);
    },
    onError: (error) => {
      Alert.alert("Could not delete", getApiErrorMessage(error));
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const canManage = (event: IEvent) =>
    canManageEvent(meQuery.data, event);

  const openCreate = () => {
    requireAuth(() => {
      router.push(href("/events/create"));
    });
  };

  const openEdit = (eventId: string) => {
    router.push(href(`/events/${eventId}/edit`));
  };

  const confirmDelete = (event: IEvent) => {
    Alert.alert(
      "Delete event?",
      `"${event.title}" will be removed for everyone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteMutation.mutate(event.id),
        },
      ],
    );
  };

  return {
    me: meQuery.data,
    isMeLoading: meQuery.isLoading,
    canManage,
    openCreate,
    openEdit,
    confirmDelete,
    deletingId,
  };
}

export { invalidateEventQueries };
