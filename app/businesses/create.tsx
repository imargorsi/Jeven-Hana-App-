import { useAuth } from "@clerk/expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { Screen } from "@/components/ui";
import { isClerkConfigured } from "@/features/auth/auth.config";
import { ClerkSignedInGuard } from "@/features/auth/components/ClerkSignedInGuard";
import {
  buildBusinessPayload,
  emptyBusinessFormValues,
  type IBusinessFormValues,
} from "@/features/businesses/businessForm.utils";
import { BusinessForm } from "@/features/businesses/components/BusinessForm";
import { resolveBusinessCoverForSubmit } from "@/features/businesses/resolveBusinessCover.utils";
import { invalidateBusinessQueries } from "@/features/businesses/useBusinessManage.hook";
import { getApiErrorMessage } from "@/lib/apiError.utils";
import { createBusiness } from "@/lib/services/businesses.service";

function CreateBusinessForm() {
  const { getToken } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<IBusinessFormValues>(
    emptyBusinessFormValues,
  );

  const mutation = useMutation({
    mutationFn: async () => {
      const base = buildBusinessPayload(values);
      if ("error" in base) {
        throw new Error(base.error);
      }

      const cover = await resolveBusinessCoverForSubmit(values, getToken);
      const result = buildBusinessPayload(values, {
        includeCover: cover.includeCover,
        coverImageUrl: cover.includeCover ? cover.coverImageUrl : undefined,
      });
      if ("error" in result) {
        throw new Error(result.error);
      }

      return createBusiness(result.payload, getToken);
    },
    onSuccess: () => {
      invalidateBusinessQueries(queryClient);
      router.back();
    },
    onError: (error) => {
      Alert.alert("Could not create", getApiErrorMessage(error));
    },
  });

  const onSubmit = () => {
    const result = buildBusinessPayload(values);
    if ("error" in result) {
      Alert.alert("Check details", result.error);
      return;
    }
    mutation.mutate();
  };

  return (
    <BusinessForm
      values={values}
      onChange={(patch) => setValues((prev) => ({ ...prev, ...patch }))}
      onSubmit={onSubmit}
      isSubmitting={mutation.isPending}
      submitLabel="Create Listing"
    />
  );
}

export default function CreateBusinessScreen() {
  const content = (
    <Screen withSafeArea={false} withAppHeader={false}>
      <CreateBusinessForm />
    </Screen>
  );

  if (!isClerkConfigured) {
    return content;
  }

  return (
    <ClerkSignedInGuard redirectHref="/register">{content}</ClerkSignedInGuard>
  );
}
