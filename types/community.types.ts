export type TPostCategory =
  | "announcements"
  | "news"
  | "alerts"
  | "lost-found"
  | "recommendations"
  | "help"
  | "buy-sell"
  | "talk";

/** Fixed v1 labels — matches API enums. */
export const POST_CATEGORY_LABELS: Record<TPostCategory, string> = {
  announcements: "Announcements",
  news: "News",
  alerts: "Alerts",
  "lost-found": "Lost & Found",
  recommendations: "Recommendations",
  help: "Looking for help",
  "buy-sell": "Buy / Sell",
  talk: "Talk",
};

export const POST_CATEGORIES: TPostCategory[] = [
  "announcements",
  "news",
  "alerts",
  "lost-found",
  "recommendations",
  "help",
  "buy-sell",
  "talk",
];

export interface ICommunityPostAuthor {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  avatarUrl?: string;
  isAdmin: boolean;
}

/** Slim v1 community post (live API shape). */
export interface ICommunityPost {
  id: string;
  content: string;
  contentIsUrdu?: boolean;
  category: TPostCategory;
  createdAt: string;
  updatedAt?: string;
  user: ICommunityPostAuthor;
  likeCount: number;
  isLikedByMe?: boolean;
  isPinned?: boolean;
  createdByUserId?: number;
}
