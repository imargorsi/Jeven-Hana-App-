/**
 * Saved items are client-persisted via Zustand.
 * This service mirrors a future REST API for easy swap-out.
 */
import type { TSavedItemType } from "@/types/saved-item.types";

export interface ISavedItemsPayload {
  businesses: string[];
  places: string[];
  events: string[];
  "best-of": string[];
}

export async function fetchSavedItemIds(): Promise<ISavedItemsPayload> {
  return {
    businesses: [],
    places: [],
    events: [],
    "best-of": [],
  };
}

export async function syncSavedItem(
  _type: TSavedItemType,
  _id: string,
  _isSaved: boolean,
): Promise<void> {
  // No-op until backend exists — Zustand is source of truth for MVP.
}
