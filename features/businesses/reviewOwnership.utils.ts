import type { IApiUser } from "@/features/auth/auth.types";
import type { IReview } from "@/types/common.types";

/** Owner or admin may edit/delete (matches API). */
export function canManageReview(
  user: IApiUser | null | undefined,
  review: IReview,
): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  return review.createdByUserId === user.id;
}
