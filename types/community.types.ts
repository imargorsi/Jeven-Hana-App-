import type { IAppUser } from "@/types/user.types";

export type TPostCategory =
  | "announcement"
  | "news"
  | "local-update"
  | "recommendation"
  | "lost-found"
  | "general";

export interface IPostComment {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  user: IAppUser;
  likeCount: number;
  isLikedByMe?: boolean;
  parentId?: string | null;
}

export interface ICommunityPost {
  id: string;
  content: string;
  imageUrls: string[];
  category: TPostCategory;
  createdAt: string;
  updatedAt?: string;
  user: IAppUser;
  likeCount: number;
  commentCount: number;
  isLikedByMe?: boolean;
  isPinned?: boolean;
  isAnnouncement?: boolean;
  likedByIds?: string[];
}
