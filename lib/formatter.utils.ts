const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function parseDate(iso: string): Date | null {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  const paddedMinutes = minutes.toString().padStart(2, "0");
  return `${hour12}:${paddedMinutes} ${period}`;
}

export function formatRelativeTime(iso: string): string {
  const date = parseDate(iso);
  if (!date) return "";

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));

  if (diffSec < 60) return "just now";
  if (diffSec < 3600) {
    const mins = Math.floor(diffSec / 60);
    return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  }
  if (diffSec < 86400) {
    const hours = Math.floor(diffSec / 3600);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  if (diffSec < 604800) {
    const days = Math.floor(diffSec / 86400);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }
  if (diffSec < 2592000) {
    const weeks = Math.floor(diffSec / 604800);
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }
  if (diffSec < 31536000) {
    const months = Math.floor(diffSec / 2592000);
    return `${months} month${months === 1 ? "" : "s"} ago`;
  }

  const years = Math.floor(diffSec / 31536000);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

export function formatEventDate(iso: string): string {
  const date = parseDate(iso);
  if (!date) return "";

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, now)) return `Today · ${formatTime(date)}`;
  if (isSameDay(date, yesterday)) return `Yesterday · ${formatTime(date)}`;

  const weekday = WEEKDAYS[date.getDay()];
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  return `${weekday}, ${day} ${month} · ${formatTime(date)}`;
}

export function formatShortDate(iso: string): string {
  const date = parseDate(iso);
  if (!date) return "";

  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/** Uppercase month for event date badges (e.g. "DEC"). */
export function formatEventMonthAbbrev(iso: string): string {
  const date = parseDate(iso);
  if (!date) return "";
  return MONTHS[date.getMonth()].toUpperCase();
}

/** Day-of-month number for event date badges (e.g. "24"). */
export function formatEventDay(iso: string): string {
  const date = parseDate(iso);
  if (!date) return "";
  return String(date.getDate());
}
