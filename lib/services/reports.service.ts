import type { IApiEnvelope } from "@/features/auth/auth.types";
import type {
  TReportReason,
  TReportTargetType,
} from "@/features/reports/report.types";
import { createApiClient, isApiConfigured } from "@/lib/api.client";

type TGetToken = () => Promise<string | null>;

export interface ICreateReportInput {
  targetType: TReportTargetType;
  targetId: string;
  reason: TReportReason;
  details?: string;
}

/**
 * POST /api/v1/reports — signed-in content report.
 */
export async function submitContentReport(
  input: ICreateReportInput,
  getToken: TGetToken,
): Promise<void> {
  if (!isApiConfigured()) {
    throw new Error(
      "API is not configured. Set EXPO_PUBLIC_API_URL or run Expo in __DEV__.",
    );
  }

  const client = createApiClient(getToken);
  const { data } = await client.post<IApiEnvelope<{ report: unknown }>>(
    "/api/v1/reports",
    input,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to submit report");
  }
}
