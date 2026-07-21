import { delay } from "@/data/mocks/mock.utils";
import {
  notifications,
  setNotifications,
} from "@/data/mocks/notifications.mock";
import type { INotification } from "@/types/notification.types";

export async function getNotifications(): Promise<INotification[]> {
  await delay();
  return [...notifications].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function markNotificationRead(id: string): Promise<void> {
  await delay(100);
  setNotifications(
    notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
  );
}

export async function markAllNotificationsRead(): Promise<void> {
  await delay(150);
  setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
}
