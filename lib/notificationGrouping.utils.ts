import type { INotification } from "@/types/notification.types";

export interface IGroupedNotification {
  key: string;
  type: INotification["type"];
  items: INotification[];
  latest: INotification;
  unreadCount: number;
}

export function groupNotifications(
  items: INotification[],
): IGroupedNotification[] {
  const map = new Map<string, INotification[]>();

  for (const item of items) {
    const key = `${item.type}:${item.targetType ?? ""}:${item.targetId ?? item.id}`;
    const bucket = map.get(key) ?? [];
    bucket.push(item);
    map.set(key, bucket);
  }

  return Array.from(map.entries()).map(([key, group]) => {
    const sorted = [...group].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return {
      key,
      type: sorted[0].type,
      items: sorted,
      latest: sorted[0],
      unreadCount: sorted.filter((n) => !n.isRead).length,
    };
  });
}
