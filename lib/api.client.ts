import { type AxiosInstance, create } from "axios";
import Constants from "expo-constants";

/**
 * Domain modules still use mocks until their REST routes exist.
 * Auth/user always hit the real API when a base URL is available.
 */
export const USE_MOCK_API = true;

/**
 * Prefer EXPO_PUBLIC_API_URL. In Expo Go /dev, fall back to the Metro host
 * on port 3001 so a physical device can reach the local Express API.
 */
export function getApiBaseUrl(): string | null {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv;
  }

  if (!__DEV__) {
    return null;
  }

  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(":")[0];
  if (!host) {
    return null;
  }

  return `http://${host}:3001`;
}

export function isApiConfigured(): boolean {
  return Boolean(getApiBaseUrl());
}

export function createApiClient(
  getToken: () => Promise<string | null>,
): AxiosInstance {
  const baseURL = getApiBaseUrl();
  if (!baseURL) {
    throw new Error(
      "API URL is not configured. Set EXPO_PUBLIC_API_URL or run Expo in __DEV__.",
    );
  }

  const client = create({
    baseURL,
    timeout: 15000,
  });

  client.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return client;
}
