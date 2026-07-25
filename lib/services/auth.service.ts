import type { IApiEnvelope, IApiUser } from "@/features/auth/auth.types";
import { createApiClient, isApiConfigured } from "@/lib/api.client";

type TGetToken = () => Promise<string | null>;

async function getAuthedClient(getToken: TGetToken) {
  if (!isApiConfigured()) {
    throw new Error("API is not configured");
  }
  return createApiClient(getToken);
}

/**
 * GET /api/v1/auth/me — upserts local user from Clerk and returns profile.
 */
export async function fetchMe(getToken: TGetToken): Promise<IApiUser> {
  const client = await getAuthedClient(getToken);
  const { data } = await client.get<IApiEnvelope<{ user: IApiUser }>>(
    "/api/v1/auth/me",
  );

  if (!data.success || !data.data?.user) {
    throw new Error(data.message || "Failed to load profile");
  }

  return data.data.user;
}

/**
 * GET /api/v1/users/me — same local user resource (alias).
 */
export async function fetchUserMe(getToken: TGetToken): Promise<IApiUser> {
  const client = await getAuthedClient(getToken);
  const { data } = await client.get<IApiEnvelope<{ user: IApiUser }>>(
    "/api/v1/users/me",
  );

  if (!data.success || !data.data?.user) {
    throw new Error(data.message || "Failed to load user");
  }

  return data.data.user;
}

/** Must match API `ACCOUNT_DELETE_CONFIRM`. */
export const ACCOUNT_DELETE_CONFIRM = "DELETE";

/**
 * DELETE /api/v1/users/me — permanently deletes Neon data + Clerk user.
 * Requires confirm: "DELETE".
 */
export async function deleteMyAccount(getToken: TGetToken): Promise<void> {
  const client = await getAuthedClient(getToken);
  const { data } = await client.delete<IApiEnvelope<{ deleted: boolean }>>(
    "/api/v1/users/me",
    { data: { confirm: ACCOUNT_DELETE_CONFIRM } },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to delete account");
  }
}
