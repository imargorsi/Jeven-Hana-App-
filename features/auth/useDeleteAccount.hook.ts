import { useAuth } from "@clerk/expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

import { getApiErrorMessage } from "@/lib/apiError.utils";
import { href } from "@/lib/navigation.utils";
import {
  ACCOUNT_DELETE_CONFIRM,
  deleteMyAccount,
} from "@/lib/services/auth.service";
import { useSavedItemsStore } from "@/stores/useSavedItemsStore";

export function useDeleteAccount() {
  const { getToken, signOut, userId } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const clearSavedForUser = useSavedItemsStore((s) => s.clearSavedForUser);
  const [confirmText, setConfirmText] = useState("");

  const canSubmit =
    confirmText.trim().toUpperCase() === ACCOUNT_DELETE_CONFIRM;

  const mutation = useMutation({
    mutationFn: () => deleteMyAccount(getToken),
    onSuccess: async () => {
      if (userId) {
        clearSavedForUser(userId);
      }
      queryClient.clear();
      await signOut();
      router.replace(href("/(tabs)"));
    },
  });

  const requestDelete = useCallback(() => {
    if (!canSubmit || mutation.isPending) {
      return;
    }

    Alert.alert(
      "Delete Account Permanently?",
      "This cannot be undone. Your listings, posts, events, and reviews will be removed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Forever",
          style: "destructive",
          onPress: () => {
            mutation.mutate(undefined, {
              onError: (error) => {
                Alert.alert(
                  "Could Not Delete Account",
                  getApiErrorMessage(
                    error,
                    "Something went wrong. Please try again or contact support.",
                  ),
                );
              },
            });
          },
        },
      ],
    );
  }, [canSubmit, mutation]);

  return {
    confirmText,
    setConfirmText,
    confirmPhrase: ACCOUNT_DELETE_CONFIRM,
    canSubmit,
    isDeleting: mutation.isPending,
    requestDelete,
  };
}
