export interface IEvent {
  id: string;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string | null;
  /** Plain address text (v1 — no lat/lng). */
  location: string;
  interestedCount: number;
  isGoingByMe?: boolean;
  createdByUserId?: number;
}
