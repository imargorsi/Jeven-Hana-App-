import type { IApiUser } from "@/features/auth/auth.types";
import type { IEvent } from "@/types/event.types";

/** Owner or admin may edit/delete (matches API). */
export function canManageEvent(
  user: IApiUser | null | undefined,
  event: IEvent,
): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (event.createdByUserId == null) return false;
  return event.createdByUserId === user.id;
}
