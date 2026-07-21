export interface IPaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
  total: number;
}

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

export interface IReview {
  id: string;
  authorName: string;
  authorAvatarUrl?: string;
  rating: number;
  comment: string;
  createdAt: string;
}
