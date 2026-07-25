import { type AxiosInstance, create } from "axios";
import Constants from "expo-constants";

let hasLoggedBaseUrl = false;

function readConfiguredApiUrl(): string | null {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv;
  }

  const fromExtra = (
    Constants.expoConfig?.extra as { apiUrl?: string } | undefined
  )?.apiUrl
    ?.trim()
    .replace(/\/$/, "");
  if (fromExtra) {
    return fromExtra;
  }

  return null;
}

/**
 * Prefer EXPO_PUBLIC_API_URL (also mirrored in app.config extra.apiUrl).
 * In Expo Go /dev, fall back to the Metro host on port 3001 for a local API.
 */
export function getApiBaseUrl(): string | null {
  const configured = readConfiguredApiUrl();
  if (configured) {
    return configured;
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

  if (__DEV__ && !hasLoggedBaseUrl) {
    hasLoggedBaseUrl = true;
    console.log(`[api] baseURL=${baseURL}`);
  }

  const client = create({
    baseURL,
    // Neon + Vercel cold starts can exceed 15s on first hit.
    timeout: 30000,
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
