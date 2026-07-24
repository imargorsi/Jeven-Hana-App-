import type { IApiUser } from "@/features/auth/auth.types";
import type { IBusiness } from "@/types/business.types";

/** Owner or admin may edit/delete (matches API). */
export function canManageBusiness(
  user: IApiUser | null | undefined,
  business: IBusiness,
): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  return business.createdByUserId === user.id;
}
