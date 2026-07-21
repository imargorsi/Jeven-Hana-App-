import { type AxiosInstance, create } from "axios";

/**
 * Future REST client. Mock services are used for MVP.
 * Set EXPO_PUBLIC_API_URL when a backend is available.
 */
export const USE_MOCK_API = true;

export function createApiClient(
  getToken: () => Promise<string | null>,
): AxiosInstance {
  const client = create({
    baseURL: process.env.EXPO_PUBLIC_API_URL ?? "https://api.example.com",
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
