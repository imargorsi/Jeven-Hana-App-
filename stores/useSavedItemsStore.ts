import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { syncSavedItem } from "@/lib/services/saved-items.service";
import { storage } from "@/lib/storage.utils";
import type { TSavedItemType } from "@/types/saved-item.types";

interface ISavedBucket {
  businesses: string[];
  places: string[];
  events: string[];
}

interface ISavedItemsState {
  /** Clerk user id → that user's bookmarks (device-local until API sync). */
  byUserId: Record<string, ISavedBucket>;
  currentUserId: string | null;
  /** Pre–per-user persist shape — migrated into `byUserId` on first sign-in. */
  _legacy?: ISavedBucket;
  setCurrentUserId: (userId: string | null) => void;
  isSaved: (type: TSavedItemType, id: string) => boolean;
  toggleSaved: (type: TSavedItemType, id: string) => void;
  removeSaved: (type: TSavedItemType, id: string) => void;
  /** Convenience lists for the signed-in user (empty when signed out). */
  businesses: string[];
  places: string[];
  events: string[];
}

const EMPTY_BUCKET: ISavedBucket = {
  businesses: [],
  places: [],
  events: [],
};

function keyFor(type: TSavedItemType): keyof ISavedBucket {
  if (type === "business") return "businesses";
  if (type === "place") return "places";
  return "events";
}

function readBucket(
  byUserId: Record<string, ISavedBucket>,
  userId: string | null,
): ISavedBucket {
  if (!userId) return EMPTY_BUCKET;
  return byUserId[userId] ?? EMPTY_BUCKET;
}

function withDerivedLists(
  byUserId: Record<string, ISavedBucket>,
  currentUserId: string | null,
): Pick<ISavedItemsState, "businesses" | "places" | "events"> {
  const bucket = readBucket(byUserId, currentUserId);
  return {
    businesses: bucket.businesses,
    places: bucket.places,
    events: bucket.events,
  };
}

export const useSavedItemsStore = create<ISavedItemsState>()(
  persist(
    (set, get) => ({
      byUserId: {},
      currentUserId: null,
      businesses: [],
      places: [],
      events: [],
      setCurrentUserId: (userId) => {
        const state = get();
        let byUserId = state.byUserId;
        const legacy = state._legacy;

        // One-time migrate old device-wide lists into this account's bucket.
        if (
          userId &&
          legacy &&
          !byUserId[userId] &&
          (legacy.businesses.length > 0 ||
            legacy.places.length > 0 ||
            legacy.events.length > 0)
        ) {
          byUserId = {
            ...byUserId,
            [userId]: {
              businesses: [...legacy.businesses],
              places: [...legacy.places],
              events: [...legacy.events],
            },
          };
        }

        set({
          currentUserId: userId,
          byUserId,
          _legacy: undefined,
          ...withDerivedLists(byUserId, userId),
        });
      },
      isSaved: (type, id) => {
        const { byUserId, currentUserId } = get();
        return readBucket(byUserId, currentUserId)[keyFor(type)].includes(id);
      },
      toggleSaved: (type, id) => {
        const { byUserId, currentUserId } = get();
        if (!currentUserId) {
          // Caller should setCurrentUserId first (SaveButton does). Fail loud in dev.
          if (__DEV__) {
            console.warn(
              "[saved] toggleSaved skipped — no currentUserId. Sign in and retry.",
            );
          }
          return;
        }

        const key = keyFor(type);
        const bucket = readBucket(byUserId, currentUserId);
        const list = bucket[key];
        const normalizedId = String(id);
        const isCurrentlySaved = list.includes(normalizedId);
        const nextList = isCurrentlySaved
          ? list.filter((x) => x !== normalizedId)
          : [...list, normalizedId];
        const nextBucket: ISavedBucket = { ...bucket, [key]: nextList };
        const nextByUser = { ...byUserId, [currentUserId]: nextBucket };

        set({
          byUserId: nextByUser,
          ...withDerivedLists(nextByUser, currentUserId),
        });
        void syncSavedItem(type, normalizedId, !isCurrentlySaved);
      },
      removeSaved: (type, id) => {
        const { byUserId, currentUserId } = get();
        if (!currentUserId) return;

        const key = keyFor(type);
        const normalizedId = String(id);
        const bucket = readBucket(byUserId, currentUserId);
        const nextBucket: ISavedBucket = {
          ...bucket,
          [key]: bucket[key].filter((x) => x !== normalizedId),
        };
        const nextByUser = { ...byUserId, [currentUserId]: nextBucket };

        set({
          byUserId: nextByUser,
          ...withDerivedLists(nextByUser, currentUserId),
        });
        void syncSavedItem(type, normalizedId, false);
      },
    }),
    {
      name: "jevan-hana-saved",
      version: 2,
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        byUserId: state.byUserId,
        _legacy: state._legacy,
      }),
      migrate: (persisted, version) => {
        const data = (persisted ?? {}) as Record<string, unknown>;

        if (version < 2) {
          const legacy: ISavedBucket = {
            businesses: Array.isArray(data.businesses)
              ? (data.businesses as string[])
              : [],
            places: Array.isArray(data.places) ? (data.places as string[]) : [],
            events: Array.isArray(data.events) ? (data.events as string[]) : [],
          };
          return {
            byUserId: {},
            _legacy: legacy,
          };
        }

        return {
          byUserId:
            (data.byUserId as Record<string, ISavedBucket> | undefined) ?? {},
          _legacy: data._legacy as ISavedBucket | undefined,
        };
      },
      onRehydrateStorage: () => () => {
        const { byUserId, currentUserId } = useSavedItemsStore.getState();
        useSavedItemsStore.setState({
          ...withDerivedLists(byUserId, currentUserId),
        });
      },
    },
  ),
);
