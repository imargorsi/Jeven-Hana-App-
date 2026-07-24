import type { IApiEnvelope } from "@/features/auth/auth.types";
import { createApiClient, isApiConfigured } from "@/lib/api.client";
import type { IEvent } from "@/types/event.types";

type TGetToken = () => Promise<string | null>;

/** Raw API event (numeric id). */
interface IApiEvent {
  id: number;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string | null;
  location: string;
  interestedCount: number;
  isGoingByMe?: boolean;
  createdByUserId?: number;
}

function requireApi() {
  if (!isApiConfigured()) {
    throw new Error(
      "API is not configured. Set EXPO_PUBLIC_API_URL or run Expo in __DEV__.",
    );
  }
}

function mapEvent(api: IApiEvent): IEvent {
  return {
    id: String(api.id),
    title: api.title,
    description: api.description,
    startsAt:
      typeof api.startsAt === "string"
        ? api.startsAt
        : new Date(api.startsAt).toISOString(),
    endsAt: api.endsAt
      ? typeof api.endsAt === "string"
        ? api.endsAt
        : new Date(api.endsAt).toISOString()
      : null,
    location: api.location,
    interestedCount: api.interestedCount,
    isGoingByMe: Boolean(api.isGoingByMe),
    createdByUserId: api.createdByUserId,
  };
}

/**
 * GET /api/v1/events — public upcoming list.
 */
export async function getEvents(getToken: TGetToken): Promise<IEvent[]> {
  requireApi();
  const client = createApiClient(getToken);
  const { data } = await client.get<IApiEnvelope<{ events: IApiEvent[] }>>(
    "/api/v1/events",
  );

  if (!data.success || !data.data?.events) {
    throw new Error(data.message || "Failed to load events");
  }

  return data.data.events.map(mapEvent);
}

/**
 * GET /api/v1/events/:id
 */
export async function getEventById(
  id: string,
  getToken: TGetToken,
): Promise<IEvent | null> {
  requireApi();
  const client = createApiClient(getToken);
  try {
    const { data } = await client.get<IApiEnvelope<{ event: IApiEvent }>>(
      `/api/v1/events/${id}`,
    );
    if (!data.success || !data.data?.event) {
      return null;
    }
    return mapEvent(data.data.event);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as { response?: { status?: number } }).response?.status === 404
    ) {
      return null;
    }
    throw error;
  }
}

/**
 * GET /api/v1/events/going/me
 */
export async function getGoingEvents(getToken: TGetToken): Promise<IEvent[]> {
  requireApi();
  const client = createApiClient(getToken);
  const { data } = await client.get<IApiEnvelope<{ events: IApiEvent[] }>>(
    "/api/v1/events/going/me",
  );

  if (!data.success || !data.data?.events) {
    throw new Error(data.message || "Failed to load going events");
  }

  return data.data.events.map(mapEvent);
}

/**
 * POST /api/v1/events/:id/going — toggle Going.
 */
export async function toggleEventGoing(
  id: string,
  getToken: TGetToken,
): Promise<IEvent> {
  requireApi();
  const client = createApiClient(getToken);
  const { data } = await client.post<IApiEnvelope<{ event: IApiEvent }>>(
    `/api/v1/events/${id}/going`,
  );

  if (!data.success || !data.data?.event) {
    throw new Error(data.message || "Failed to update Going");
  }

  return mapEvent(data.data.event);
}

export interface IEventWriteInput {
  title: string;
  location: string;
  startsAt: string;
  endsAt?: string | null;
  description?: string | null;
}

export type TEventUpdateInput = Partial<IEventWriteInput>;

/**
 * POST /api/v1/events — create (signed-in, live immediately).
 */
export async function createEvent(
  input: IEventWriteInput,
  getToken: TGetToken,
): Promise<IEvent> {
  requireApi();
  const client = createApiClient(getToken);
  const { data } = await client.post<IApiEnvelope<{ event: IApiEvent }>>(
    "/api/v1/events",
    input,
  );

  if (!data.success || !data.data?.event) {
    throw new Error(data.message || "Failed to create event");
  }

  return mapEvent(data.data.event);
}

/**
 * PATCH /api/v1/events/:id — owner or admin.
 */
export async function updateEvent(
  id: string,
  input: TEventUpdateInput,
  getToken: TGetToken,
): Promise<IEvent> {
  requireApi();
  const client = createApiClient(getToken);
  const { data } = await client.patch<IApiEnvelope<{ event: IApiEvent }>>(
    `/api/v1/events/${id}`,
    input,
  );

  if (!data.success || !data.data?.event) {
    throw new Error(data.message || "Failed to update event");
  }

  return mapEvent(data.data.event);
}

/**
 * DELETE /api/v1/events/:id — owner or admin.
 */
export async function deleteEvent(
  id: string,
  getToken: TGetToken,
): Promise<IEvent> {
  requireApi();
  const client = createApiClient(getToken);
  const { data } = await client.delete<IApiEnvelope<{ event: IApiEvent }>>(
    `/api/v1/events/${id}`,
  );

  if (!data.success || !data.data?.event) {
    throw new Error(data.message || "Failed to delete event");
  }

  return mapEvent(data.data.event);
}
