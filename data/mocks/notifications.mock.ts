import type { INotification } from "@/types/notification.types";

export let notifications: INotification[] = [
  {
    id: "notif-1",
    type: "admin_announcement",
    title: "Water supply notice",
    body: "Maintenance tomorrow 10am–2pm in Block A.",
    createdAt: "2026-07-20T08:05:00Z",
    isRead: false,
    actorName: "Jevan Hana Admin",
    actorAvatarUrl: undefined,
    targetType: "post",
    targetId: "post-1",
  },
  {
    id: "notif-2",
    type: "like",
    title: "Sara liked your post",
    body: "Your recommendation got a like.",
    createdAt: "2026-07-19T20:00:00Z",
    isRead: false,
    actorName: "Sara Ahmed",
    targetType: "post",
    targetId: "post-3",
  },
  {
    id: "notif-3",
    type: "comment",
    title: "New comment",
    body: "Bilal commented on the lost pet post.",
    createdAt: "2026-07-19T17:05:00Z",
    isRead: true,
    actorName: "Bilal Khan",
    targetType: "post",
    targetId: "post-2",
  },
  {
    id: "notif-4",
    type: "event_reminder",
    title: "Friday Bazaar tomorrow",
    body: "Starts at 9am at the community hall.",
    createdAt: "2026-07-23T09:00:00Z",
    isRead: false,
    targetType: "event",
    targetId: "evt-1",
  },
  {
    id: "notif-5",
    type: "business_update",
    title: "CarePlus hours updated",
    body: "Now open 24/7 for emergencies.",
    createdAt: "2026-07-18T11:00:00Z",
    isRead: true,
    targetType: "business",
    targetId: "biz-4",
  },
  {
    id: "notif-6",
    type: "moderation_update",
    title: "Report reviewed",
    body: "Thanks — we reviewed your report.",
    createdAt: "2026-07-15T14:00:00Z",
    isRead: true,
  },
];

export function setNotifications(next: INotification[]) {
  notifications = next;
}
