import type { IApiEnvelope } from "@/features/auth/auth.types";
import { createApiClient, isApiConfigured } from "@/lib/api.client";
import type { INotification } from "@/types/notification.types";

type TGetToken = () => Promise<string | null>;

interface IApiNotification {
  id: string;
  type: INotification["type"];
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
  actorName?: string;
  actorAvatarUrl?: string | null;
  targetType?: INotification["targetType"];
  targetId?: string;
}

interface INotificationsListData {
  notifications: IApiNotification[];
  unreadCount: number;
}

export interface INotificationsPage {
  notifications: INotification[];
  unreadCount: number;
}

function requireApi() {
  if (!isApiConfigured()) {
    throw new Error(
      "API is not configured. Set EXPO_PUBLIC_API_URL or run Expo in __DEV__.",
    );
  }
}

function mapNotification(api: IApiNotification): INotification {
  return {
    id: String(api.id),
    type: api.type,
    title: api.title,
    body: api.body,
    createdAt: api.createdAt,
    isRead: Boolean(api.isRead),
    actorName: api.actorName,
    actorAvatarUrl: api.actorAvatarUrl?.trim() || undefined,
    targetType: api.targetType,
    targetId: api.targetId,
  };
}

/** GET /api/v1/notifications — signed-in inbox (+ server unreadCount). */
export async function getNotificationsPage(
  getToken: TGetToken,
  limit = 30,
): Promise<INotificationsPage> {
  requireApi();
  const client = createApiClient(getToken);
  const { data } = await client.get<IApiEnvelope<INotificationsListData>>(
    "/api/v1/notifications",
    { params: { limit } },
  );

  if (!data.success || !data.data?.notifications) {
    throw new Error(data.message || "Failed to load notifications");
  }

  return {
    notifications: data.data.notifications.map(mapNotification),
    unreadCount: data.data.unreadCount ?? 0,
  };
}

/** Full inbox list (notifications screen). */
export async function getNotifications(
  getToken: TGetToken,
  limit = 30,
): Promise<INotification[]> {
  const page = await getNotificationsPage(getToken, limit);
  return page.notifications;
}

/**
 * Badge-only fetch — tiny page; unreadCount is a server COUNT
 * (not derived from the returned rows).
 */
export async function getNotificationsUnreadCount(
  getToken: TGetToken,
): Promise<number> {
  const page = await getNotificationsPage(getToken, 1);
  return page.unreadCount;
}

/** PATCH /api/v1/notifications/:id/read */
export async function markNotificationRead(
  id: string,
  getToken: TGetToken,
): Promise<void> {
  requireApi();
  const client = createApiClient(getToken);
  const { data } = await client.patch<IApiEnvelope<unknown>>(
    `/api/v1/notifications/${id}/read`,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to mark notification read");
  }
}

/** POST /api/v1/notifications/read-all */
export async function markAllNotificationsRead(
  getToken: TGetToken,
): Promise<void> {
  requireApi();
  const client = createApiClient(getToken);
  const { data } = await client.post<IApiEnvelope<unknown>>(
    "/api/v1/notifications/read-all",
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to mark all notifications read");
  }
}
