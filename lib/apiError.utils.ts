import { isAxiosError } from "axios";

import type { IApiEnvelope } from "@/features/auth/auth.types";

/** Human-readable message from API / network failures. */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (isAxiosError(error)) {
    const payload = error.response?.data as IApiEnvelope<unknown> | undefined;
    if (payload?.message) {
      return payload.message;
    }
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      return "Cannot reach the server. Check that the API is running.";
    }
    if (error.response?.status === 401) {
      return "Sign in required.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
