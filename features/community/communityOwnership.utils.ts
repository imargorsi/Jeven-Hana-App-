import type { IApiUser } from "@/features/auth/auth.types";
import type { ICommunityPost } from "@/types/community.types";

/** Owner or admin may edit/delete (matches API). */
export function canManageCommunityPost(
  user: IApiUser | null | undefined,
  post: ICommunityPost,
): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (post.createdByUserId == null) return false;
  return post.createdByUserId === user.id;
}
