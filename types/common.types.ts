export interface IPaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
  total: number;
}

/** Local `require()` asset id or remote URI. */
export type TAppImage = number | string;

export interface IOpeningHours {
  day: string;
  open: string;
  close: string;
  isClosed?: boolean;
}

export interface IGeoLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface IReviewAuthor {
  id: number;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  role: "user" | "admin";
}

export interface IReview {
  id: string;
  businessId: string;
  rating: number;
  comment: string;
  createdByUserId: number;
  authorName: string;
  authorAvatarUrl?: string | null;
  author?: IReviewAuthor | null;
  createdAt: string;
  updatedAt?: string;
}
