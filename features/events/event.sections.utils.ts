import type { IEvent } from "@/types/event.types";

export type TEventSectionKey =
  | "today"
  | "this-week"
  | "next-week"
  | "this-month";

export interface IEventSection {
  key: TEventSectionKey;
  title: string;
  events: IEvent[];
}

const SECTION_ORDER: { key: TEventSectionKey; title: string }[] = [
  { key: "today", title: "Today" },
  { key: "this-week", title: "This Week" },
  { key: "next-week", title: "Next Week" },
  { key: "this-month", title: "This Month" },
];

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Monday-start week (local). */
function startOfWeek(date: Date): Date {
  const day = startOfDay(date);
  const weekday = day.getDay(); // 0 Sun … 6 Sat
  const offset = weekday === 0 ? -6 : 1 - weekday;
  day.setDate(day.getDate() + offset);
  return day;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function isBefore(a: Date, b: Date): boolean {
  return a.getTime() < b.getTime();
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getSectionKey(startsAt: string, now = new Date()): TEventSectionKey | null {
  const start = new Date(startsAt);
  if (Number.isNaN(start.getTime())) return null;

  const today = startOfDay(now);
  const eventDay = startOfDay(start);

  if (isBefore(eventDay, today)) return null;

  if (isSameCalendarDay(eventDay, today)) return "today";

  const weekStart = startOfWeek(today);
  const weekEnd = addDays(weekStart, 7); // exclusive
  const nextWeekEnd = addDays(weekStart, 14); // exclusive

  if (isBefore(eventDay, weekEnd)) return "this-week";
  if (isBefore(eventDay, nextWeekEnd)) return "next-week";

  // Remaining upcoming events (rest of this month and beyond).
  return "this-month";
}

/** Group upcoming events into Today / This Week / Next Week / This Month. */
export function groupEventsBySection(
  events: IEvent[],
  now = new Date(),
): IEventSection[] {
  const buckets: Record<TEventSectionKey, IEvent[]> = {
    today: [],
    "this-week": [],
    "next-week": [],
    "this-month": [],
  };

  const sorted = [...events].sort(
    (a, b) =>
      new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );

  for (const event of sorted) {
    const key = getSectionKey(event.startsAt, now);
    if (key) buckets[key].push(event);
  }

  return SECTION_ORDER.map(({ key, title }) => ({
    key,
    title,
    events: buckets[key],
  })).filter((section) => section.events.length > 0);
}
