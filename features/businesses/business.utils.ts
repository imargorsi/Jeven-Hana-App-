import { formatHourMinute12h } from "@/lib/formatter.utils";
import type { IOpeningHours } from "@/types/common.types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function getBusinessOpenStatus(hours?: IOpeningHours[] | null): {
  isOpen: boolean;
  detail: string;
  hasHours: boolean;
} {
  if (!hours || hours.length === 0) {
    return { isOpen: false, detail: "", hasHours: false };
  }

  const todayKey = WEEKDAYS[new Date().getDay()];
  const today = hours.find((h) => h.day === todayKey);

  if (!today || today.isClosed) {
    return { isOpen: false, detail: "Closed today", hasHours: true };
  }

  return {
    isOpen: true,
    detail: `Closes ${formatHourMinute12h(today.close)}`,
    hasHours: true,
  };
}
