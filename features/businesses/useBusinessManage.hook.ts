import { useAuth } from "@clerk/expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { useMe } from "@/features/auth/useMe.hook";
import { useRequireAuth } from "@/features/auth/useRequireAuth.hook";
import { canManageBusiness } from "@/features/businesses/businessOwnership.utils";
import { getApiErrorMessage } from "@/lib/apiError.utils";
import { href } from "@/lib/navigation.utils";
import { deleteBusiness } from "@/lib/services/businesses.service";
import type { IBusiness } from "@/types/business.types";

function invalidateBusinessQueries(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  void queryClient.invalidateQueries({ queryKey: ["explore-businesses"] });
  void queryClient.invalidateQueries({ queryKey: ["home-nearby-highlights"] });
  void queryClient.invalidateQueries({ queryKey: ["business"] });
  void queryClient.invalidateQueries({ queryKey: ["search"] });
  void queryClient.invalidateQueries({ queryKey: ["saved-item"] });
}

/** Create / edit navigation + owner/admin delete for business cards. */
export function useBusinessManage() {
  const { getToken } = useAuth();
  const meQuery = useMe();
  const { requireAuth } = useRequireAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBusiness(id, getToken),
    onMutate: (id) => {
      setDeletingId(id);
    },
    onSuccess: () => {
      invalidateBusinessQueries(queryClient);
    },
    onError: (error) => {
      Alert.alert("Could not delete", getApiErrorMessage(error));
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const canManage = (business: IBusiness) =>
    canManageBusiness(meQuery.data, business);

  const openCreate = () => {
    requireAuth(() => {
      router.push(href("/businesses/create"));
    });
  };

  const openEdit = (businessId: string) => {
    router.push(href(`/businesses/${businessId}/edit`));
  };

  const confirmDelete = (
    business: IBusiness,
    options?: { onDeleted?: () => void },
  ) => {
    Alert.alert(
      "Delete Listing?",
      `"${business.name}" will be removed for everyone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            deleteMutation.mutate(business.id, {
              onSuccess: () => {
                options?.onDeleted?.();
              },
            }),
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

export { invalidateBusinessQueries };
