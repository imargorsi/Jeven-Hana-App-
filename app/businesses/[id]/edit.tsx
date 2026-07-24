import { useAuth } from "@clerk/expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { ErrorState, LoadingBlock, Screen } from "@/components/ui";
import { isClerkConfigured } from "@/features/auth/auth.config";
import { ClerkSignedInGuard } from "@/features/auth/components/ClerkSignedInGuard";
import { useMe } from "@/features/auth/useMe.hook";
import {
  buildBusinessPayload,
  businessToFormValues,
  type IBusinessFormValues,
} from "@/features/businesses/businessForm.utils";
import { canManageBusiness } from "@/features/businesses/businessOwnership.utils";
import { BusinessForm } from "@/features/businesses/components/BusinessForm";
import { invalidateBusinessQueries } from "@/features/businesses/useBusinessManage.hook";
import { getApiErrorMessage } from "@/lib/apiError.utils";
import {
  getBusinessById,
  toggleBusinessFeatured,
  updateBusiness,
} from "@/lib/services/businesses.service";
import type { IBusiness } from "@/types/business.types";

function EditBusinessForm({ business }: { business: IBusiness }) {
  const { getToken } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const meQuery = useMe();
  const [values, setValues] = useState<IBusinessFormValues>(() =>
    businessToFormValues(business),
  );
  const [isFeatured, setIsFeatured] = useState(business.isFeatured);

  const mutation = useMutation({
    mutationFn: () => {
      const result = buildBusinessPayload(values);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return updateBusiness(business.id, result.payload, getToken);
    },
    onSuccess: () => {
      invalidateBusinessQueries(queryClient);
      void queryClient.invalidateQueries({
        queryKey: ["business", business.id],
      });
      router.back();
    },
    onError: (error) => {
      Alert.alert("Could not save", getApiErrorMessage(error));
    },
  });

  const featuredMutation = useMutation({
    mutationFn: () => toggleBusinessFeatured(business.id, getToken),
    onSuccess: (updated) => {
      setIsFeatured(updated.isFeatured);
      invalidateBusinessQueries(queryClient);
      void queryClient.invalidateQueries({
        queryKey: ["business", business.id],
      });
    },
    onError: (error) => {
      Alert.alert("Could not update Featured", getApiErrorMessage(error));
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

  const isAdmin = meQuery.data?.role === "admin";

  return (
    <BusinessForm
      values={values}
      onChange={(patch) => setValues((prev) => ({ ...prev, ...patch }))}
      onSubmit={onSubmit}
      isSubmitting={mutation.isPending}
      submitLabel="Save Changes"
      showFeatured={isAdmin}
      isFeatured={isFeatured}
      onFeaturedToggle={() => featuredMutation.mutate()}
      isTogglingFeatured={featuredMutation.isPending}
    />
  );
}

function EditBusinessContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const businessId = typeof id === "string" ? id : id?.[0];
  const { getToken } = useAuth();
  const meQuery = useMe();

  const businessQuery = useQuery({
    queryKey: ["business", businessId],
    queryFn: () => getBusinessById(businessId!, getToken),
    enabled: Boolean(businessId),
  });

  if (!businessId) {
    return (
      <Screen withSafeArea={false} withAppHeader={false} className="px-4">
        <ErrorState description="Missing listing id." />
      </Screen>
    );
  }

  if (businessQuery.isLoading || meQuery.isLoading) {
    return (
      <Screen withSafeArea={false} withAppHeader={false}>
        <LoadingBlock />
      </Screen>
    );
  }

  if (businessQuery.isError) {
    return (
      <Screen withSafeArea={false} withAppHeader={false} className="px-4">
        <ErrorState
          description={getApiErrorMessage(businessQuery.error)}
          onRetry={() => void businessQuery.refetch()}
        />
      </Screen>
    );
  }

  if (!businessQuery.data) {
    return (
      <Screen withSafeArea={false} withAppHeader={false} className="px-4">
        <ErrorState description="Listing not found." />
      </Screen>
    );
  }

  if (!canManageBusiness(meQuery.data, businessQuery.data)) {
    return (
      <Screen withSafeArea={false} withAppHeader={false} className="px-4">
        <ErrorState description="You can only edit your own listings." />
      </Screen>
    );
  }

  return (
    <Screen withSafeArea={false} withAppHeader={false}>
      <EditBusinessForm
        key={businessQuery.data.id}
        business={businessQuery.data}
      />
    </Screen>
  );
}

export default function EditBusinessScreen() {
  if (!isClerkConfigured) {
    return <EditBusinessContent />;
  }

  return (
    <ClerkSignedInGuard redirectHref="/register">
      <EditBusinessContent />
    </ClerkSignedInGuard>
  );
}
