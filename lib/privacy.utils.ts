import { getApiBaseUrl } from "@/lib/api.client";

/**
 * HTTPS URL for Play Console / external links.
 * Prefer EXPO_PUBLIC_PRIVACY_POLICY_URL; else API `/privacy`.
 */
export function getPrivacyPolicyUrl(): string | null {
  const fromEnv = process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL?.replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv;
  }

  const api = getApiBaseUrl();
  if (!api) {
    return null;
  }

  return `${api}/privacy`;
}
