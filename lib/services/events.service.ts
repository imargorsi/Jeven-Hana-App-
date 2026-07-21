import { events, eventCategories } from "@/data/mocks/events.mock";
import { delay, paginate } from "@/data/mocks/mock.utils";
import type { IPaginatedResult } from "@/types/common.types";
import type { IEvent, IEventCategory, TEventCategorySlug } from "@/types/event.types";

const interestedIds = new Set<string>();

export async function getEventCategories(): Promise<IEventCategory[]> {
  await delay();
  return eventCategories;
}

export async function getEvents(params?: {
  categorySlug?: TEventCategorySlug;
  featuredOnly?: boolean;
  upcomingOnly?: boolean;
  pastOnly?: boolean;
  date?: string;
  cursor?: string | null;
  limit?: number;
}): Promise<IPaginatedResult<IEvent>> {
  await delay();
  const now = Date.now();
  let list = events.map((e) => ({
    ...e,
    isInterestedByMe: interestedIds.has(e.id),
  }));

  if (params?.categorySlug) {
    list = list.filter((e) => e.categorySlug === params.categorySlug);
  }
  if (params?.featuredOnly) {
    list = list.filter((e) => e.isFeatured);
  }
  if (params?.upcomingOnly) {
    list = list.filter((e) => new Date(e.startsAt).getTime() >= now);
  }
  if (params?.pastOnly) {
    list = list.filter((e) => new Date(e.endsAt).getTime() < now);
  }
  if (params?.date) {
    const day = params.date.slice(0, 10);
    list = list.filter((e) => e.startsAt.startsWith(day));
  }

  list.sort(
    (a, b) =>
      new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
  return paginate(list, params?.cursor, params?.limit ?? 20);
}

export async function getEventById(id: string): Promise<IEvent | null> {
  await delay();
  const event = events.find((e) => e.id === id);
  if (!event) return null;
  return { ...event, isInterestedByMe: interestedIds.has(id) };
}

export async function toggleEventInterested(id: string): Promise<IEvent | null> {
  await delay(150);
  const event = events.find((e) => e.id === id);
  if (!event) return null;
  if (interestedIds.has(id)) {
    interestedIds.delete(id);
    return {
      ...event,
      interestedCount: Math.max(0, event.interestedCount - 1),
      isInterestedByMe: false,
    };
  }
  interestedIds.add(id);
  return {
    ...event,
    interestedCount: event.interestedCount + 1,
    isInterestedByMe: true,
  };
}
