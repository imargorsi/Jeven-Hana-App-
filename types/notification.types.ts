export type TNotificationType =
  | "admin_announcement"
  | "community_post"
  | "comment"
  | "like"
  | "event_reminder"
  | "business_update"
  | "moderation_update";

export interface INotification {
  id: string;
  type: TNotificationType;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
  actorName?: string;
  actorAvatarUrl?: string;
  /** Optional deep-link target */
  targetType?: "post" | "event" | "business" | "place" | "best-of";
  targetId?: string;
}
