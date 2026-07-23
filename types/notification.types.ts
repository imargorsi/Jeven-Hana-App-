import type { TAppImage } from "@/types/common.types";

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
  actorAvatarUrl?: TAppImage;
  /** Optional deep-link target */
  targetType?: "post" | "event" | "business" | "place";
  targetId?: string;
}
