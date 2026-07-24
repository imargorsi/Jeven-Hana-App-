/** Local date/time helpers for the slim event form (no picker library). */

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function splitIsoToLocalParts(iso: string): {
  date: string;
  time: string;
} {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return { date: "", time: "" };
  }
  return {
    date: `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`,
    time: `${pad2(d.getHours())}:${pad2(d.getMinutes())}`,
  };
}

/** Combine YYYY-MM-DD + HH:mm into a local Date (null if invalid). */
export function combineLocalDateTime(
  dateStr: string,
  timeStr: string,
): Date | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  const timeMatch = /^(\d{1,2}):(\d{2})$/.exec(timeStr.trim());
  if (!dateMatch || !timeMatch) return null;

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);

  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  const date = new Date(year, month - 1, day, hour, minute, 0, 0);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

/** Default start: tomorrow at 18:00 local. */
export function defaultStartsParts(now = new Date()): {
  date: string;
  time: string;
} {
  const d = new Date(now);
  d.setDate(d.getDate() + 1);
  d.setHours(18, 0, 0, 0);
  return {
    date: `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`,
    time: `${pad2(d.getHours())}:${pad2(d.getMinutes())}`,
  };
}

/** Build a Date for the native picker from stored parts. */
export function partsToPickerDate(
  dateStr: string,
  timeStr: string,
  fallback = new Date(),
): Date {
  const combined = combineLocalDateTime(
    dateStr.trim() || splitIsoToLocalParts(fallback.toISOString()).date,
    timeStr.trim() || "18:00",
  );
  return combined ?? fallback;
}

export function dateToDatePart(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function dateToTimePart(date: Date): string {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

export interface IEventFormValues {
  title: string;
  location: string;
  startsDate: string;
  startsTime: string;
  endsDate: string;
  endsTime: string;
  description: string;
}

export function emptyEventFormValues(): IEventFormValues {
  const starts = defaultStartsParts();
  return {
    title: "",
    location: "",
    startsDate: starts.date,
    startsTime: starts.time,
    endsDate: "",
    endsTime: "",
    description: "",
  };
}

export function eventToFormValues(event: {
  title: string;
  location: string;
  startsAt: string;
  endsAt: string | null;
  description: string | null;
}): IEventFormValues {
  const starts = splitIsoToLocalParts(event.startsAt);
  const ends = event.endsAt
    ? splitIsoToLocalParts(event.endsAt)
    : { date: "", time: "" };

  return {
    title: event.title,
    location: event.location,
    startsDate: starts.date,
    startsTime: starts.time,
    endsDate: ends.date,
    endsTime: ends.time,
    description: event.description ?? "",
  };
}

export type TEventFormPayload = {
  title: string;
  location: string;
  startsAt: string;
  endsAt: string | null;
  description: string | null;
};

/**
 * Validate form → API payload, or return an error message.
 */
export function buildEventPayload(
  values: IEventFormValues,
): { payload: TEventFormPayload } | { error: string } {
  const title = values.title.trim();
  if (!title) return { error: "Title is required." };

  const location = values.location.trim();
  if (!location) return { error: "Location is required." };

  const startsAt = combineLocalDateTime(values.startsDate, values.startsTime);
  if (!startsAt) {
    return { error: "Please choose a start date and time." };
  }

  const hasEndDate = Boolean(values.endsDate.trim());
  const hasEndTime = Boolean(values.endsTime.trim());
  let endsAt: Date | null = null;

  if (hasEndDate || hasEndTime) {
    if (!hasEndDate || !hasEndTime) {
      return { error: "End needs both date and time, or leave both empty." };
    }
    endsAt = combineLocalDateTime(values.endsDate, values.endsTime);
    if (!endsAt) {
      return { error: "Please choose a valid end date and time." };
    }
    if (endsAt.getTime() < startsAt.getTime()) {
      return { error: "End must be on or after the start." };
    }
  }

  const description = values.description.trim();

  return {
    payload: {
      title,
      location,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt ? endsAt.toISOString() : null,
      description: description.length ? description : null,
    },
  };
}
