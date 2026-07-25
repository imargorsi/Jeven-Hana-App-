import { useCallback } from "react";
import { Alert, Platform } from "react-native";

import { useAuth } from "@clerk/expo";
import { useMutation } from "@tanstack/react-query";

import { useRequireAuth } from "@/features/auth/useRequireAuth.hook";
import {
  REPORT_REASON_OPTIONS,
  type TReportReason,
  type TReportTargetType,
} from "@/features/reports/report.types";
import { getApiErrorMessage } from "@/lib/apiError.utils";
import { submitContentReport } from "@/lib/services/reports.service";

function targetLabel(type: TReportTargetType): string {
  if (type === "post") return "post";
  if (type === "business") return "listing";
  return "event";
}

/**
 * Shared report flow: auth gate → reason picker → submit → thank-you.
 */
export function useReportContent() {
  const { getToken } = useAuth();
  const { requireAuth } = useRequireAuth();

  const mutation = useMutation({
    mutationFn: (input: {
      targetType: TReportTargetType;
      targetId: string;
      reason: TReportReason;
    }) => submitContentReport(input, getToken),
  });

  const submitReason = useCallback(
    (
      targetType: TReportTargetType,
      targetId: string,
      reason: TReportReason,
    ) => {
      mutation.mutate(
        { targetType, targetId, reason },
        {
          onSuccess: () => {
            Alert.alert(
              "Report Submitted",
              "Thanks. Our team will review this and take action if needed.",
            );
          },
          onError: (error) => {
            Alert.alert(
              "Could Not Report",
              getApiErrorMessage(error, "Please try again in a moment."),
            );
          },
        },
      );
    },
    [mutation],
  );

  const pickReason = useCallback(
    (targetType: TReportTargetType, targetId: string) => {
      Alert.alert("Select A Reason", `Why are you reporting this ${targetLabel(targetType)}?`, [
        ...REPORT_REASON_OPTIONS.map((option) => ({
          text: option.label,
          onPress: () => submitReason(targetType, targetId, option.value),
        })),
        { text: "Cancel", style: "cancel" as const },
      ]);
    },
    [submitReason],
  );

  const openReport = useCallback(
    (targetType: TReportTargetType, targetId: string) => {
      requireAuth(() => {
        const label = targetLabel(targetType);

        Alert.alert(
          "Report This Content?",
          Platform.OS === "ios"
            ? `This helps keep Jevan Hana safe. Choose why you are reporting this ${label}.`
            : `This helps keep Jevan Hana safe. Tap Continue, then choose a reason for this ${label}.`,
          Platform.OS === "ios"
            ? [
                ...REPORT_REASON_OPTIONS.map((option) => ({
                  text: option.label,
                  onPress: () =>
                    submitReason(targetType, targetId, option.value),
                })),
                { text: "Cancel", style: "cancel" as const },
              ]
            : [
                {
                  text: "Continue",
                  onPress: () => pickReason(targetType, targetId),
                },
                { text: "Cancel", style: "cancel" },
              ],
        );
      });
    },
    [pickReason, requireAuth, submitReason],
  );

  return {
    openReport,
    isReporting: mutation.isPending,
  };
}
