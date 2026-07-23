import { formatHourMinute12h } from "@/lib/formatter.utils";
import type { IOpeningHours } from "@/types/common.types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function getBusinessOpenStatus(hours: IOpeningHours[]): {
  isOpen: boolean;
  detail: string;
} {
  const todayKey = WEEKDAYS[new Date().getDay()];
  const today = hours.find((h) => h.day === todayKey);

  if (!today || today.isClosed) {
    return { isOpen: false, detail: "Closed today" };
  }

  return {
    isOpen: true,
    detail: `Closes ${formatHourMinute12h(today.close)}`,
  };
}
