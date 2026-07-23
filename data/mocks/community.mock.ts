import { IMG } from "@/data/mocks/mock.utils";
import type { ICommunityPost, IPostComment } from "@/types/community.types";
import type { IAppUser } from "@/types/user.types";

export const mockUsers: IAppUser[] = [
  {
    id: "user-admin",
    username: "jevanhana_admin",
    firstName: "Jevan",
    lastName: "Hana",
    fullName: "Jevan Hana Community",
    avatarUrl: IMG.logo,
    isAdmin: true,
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "user-1",
    username: "sara_jh",
    firstName: "Sara",
    lastName: "Ahmed",
    fullName: "Sara Ahmed",
    avatarUrl: IMG.avatar,
    createdAt: "2025-03-01T00:00:00Z",
  },
  {
    id: "user-2",
    username: "bilal_gt",
    firstName: "Bilal",
    lastName: "Khan",
    fullName: "Bilal Khan",
    createdAt: "2025-04-12T00:00:00Z",
  },
];

const admin = mockUsers[0];

export let communityPosts: ICommunityPost[] = [
  {
    id: "post-admin-1",
    content:
      "آج محلے کی صفائی مہم کامیابی سے مکمل ہوئی۔ سب پڑوسیوں کا شکریہ جو آئے!",
    contentIsUrdu: true,
    imageUrls: [IMG.community],
    category: "announcement",
    createdAt: "2026-07-23T10:00:00Z",
    user: admin,
    likeCount: 124,
    commentCount: 12,
    isPinned: true,
    isAnnouncement: true,
    likedByIds: [],
    reactions: [
      { emoji: "👍", count: 48 },
      { emoji: "❤️", count: 52 },
      { emoji: "🎉", count: 24 },
    ],
  },
  {
    id: "post-admin-2",
    content:
      "Water supply maintenance this Friday, 10am–2pm in Block A & B. Please store water in advance.",
    contentIsUrdu: false,
    imageUrls: [IMG.street],
    category: "announcement",
    createdAt: "2026-07-22T14:30:00Z",
    user: admin,
    likeCount: 89,
    commentCount: 18,
    isPinned: true,
    isAnnouncement: true,
    likedByIds: [],
    reactions: [
      { emoji: "👍", count: 61 },
      { emoji: "🔥", count: 18 },
      { emoji: "👏", count: 10 },
    ],
  },
  {
    id: "post-admin-3",
    content:
      "جمعہ بازار اس ہفتے کمیونٹی ہال میں ہوگا — بچوں کے لیے کتابوں کا اسٹال بھی لگے گا۔",
    contentIsUrdu: true,
    imageUrls: [IMG.event],
    category: "news",
    createdAt: "2026-07-21T09:00:00Z",
    user: admin,
    likeCount: 76,
    commentCount: 9,
    isAnnouncement: true,
    likedByIds: [],
    reactions: [
      { emoji: "❤️", count: 34 },
      { emoji: "🎉", count: 28 },
      { emoji: "👍", count: 14 },
    ],
  },
  {
    id: "post-1",
    content:
      "📢 Water supply maintenance tomorrow 10am–2pm in Block A. Please store water. — Jevan Hana Admin",
    imageUrls: [],
    category: "announcement",
    createdAt: "2026-07-20T08:00:00Z",
    user: admin,
    likeCount: 42,
    commentCount: 8,
    isPinned: true,
    isAnnouncement: true,
    likedByIds: [],
    reactions: [
      { emoji: "👍", count: 30 },
      { emoji: "👏", count: 12 },
    ],
  },
  {
    id: "post-2",
    content:
      "Lost golden retriever near Hana Family Park. Please DM if seen. Collar has a blue tag.",
    imageUrls: [IMG.park],
    category: "lost-found",
    createdAt: "2026-07-19T16:30:00Z",
    user: mockUsers[1],
    likeCount: 18,
    commentCount: 5,
    likedByIds: [],
    reactions: [
      { emoji: "❤️", count: 12 },
      { emoji: "👍", count: 6 },
    ],
  },
  {
    id: "post-3",
    content:
      "Strongly recommend Garden Town Grill for family dinner — great karahi and parking nearby.",
    imageUrls: [IMG.restaurant],
    category: "recommendation",
    createdAt: "2026-07-18T19:00:00Z",
    user: mockUsers[2],
    likeCount: 31,
    commentCount: 4,
    likedByIds: [],
    reactions: [
      { emoji: "🔥", count: 20 },
      { emoji: "👍", count: 11 },
    ],
  },
  {
    id: "post-4",
    content:
      "Local update: new street lights installed on Lane 3. Looking cleaner at night!",
    imageUrls: [],
    category: "local-update",
    createdAt: "2026-07-17T12:00:00Z",
    user: mockUsers[1],
    likeCount: 22,
    commentCount: 2,
    likedByIds: [],
  },
  {
    id: "post-5",
    content:
      "Friday bazaar this week will include a book stall for kids. See you at the community hall.",
    imageUrls: [IMG.event],
    category: "news",
    createdAt: "2026-07-16T09:00:00Z",
    user: admin,
    likeCount: 55,
    commentCount: 11,
    isAnnouncement: true,
    likedByIds: [],
    reactions: [
      { emoji: "🎉", count: 33 },
      { emoji: "👍", count: 22 },
    ],
  },
];

export let postComments: IPostComment[] = [
  {
    id: "cmt-1",
    postId: "post-1",
    content: "Thanks for the heads up!",
    createdAt: "2026-07-20T09:00:00Z",
    user: mockUsers[1],
    likeCount: 3,
  },
  {
    id: "cmt-2",
    postId: "post-1",
    content: "Block B affected too?",
    createdAt: "2026-07-20T09:15:00Z",
    user: mockUsers[2],
    likeCount: 1,
  },
  {
    id: "cmt-3",
    postId: "post-2",
    content: "Sharing with the neighbourhood WhatsApp group.",
    createdAt: "2026-07-19T17:00:00Z",
    user: mockUsers[2],
    likeCount: 5,
  },
];

export function setCommunityPosts(next: ICommunityPost[]) {
  communityPosts = next;
}

export function setPostComments(next: IPostComment[]) {
  postComments = next;
}
