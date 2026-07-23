import type { TAppImage } from "@/types/common.types";
import type { IAppUser } from "@/types/user.types";

export type TPostCategory =
  | "announcement"
  | "news"
  | "local-update"
  | "recommendation"
  | "lost-found"
  | "general";

/** Top reaction emojis residents can use on admin community posts. */
export type TReactionEmoji = "👍" | "❤️" | "🎉" | "👏" | "🔥";

export interface IPostReaction {
  emoji: TReactionEmoji;
  count: number;
}

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
  /** When true, render content RTL with Urdu font. */
  contentIsUrdu?: boolean;
  imageUrls: TAppImage[];
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
  /** Per-emoji reaction counts. */
  reactions?: IPostReaction[];
}
