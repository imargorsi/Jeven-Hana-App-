import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { syncSavedItem } from "@/lib/services/saved-items.service";
import { storage } from "@/lib/storage.utils";
import type { TSavedItemType } from "@/types/saved-item.types";

interface ISavedItemsState {
  businesses: string[];
  places: string[];
  events: string[];
  "best-of": string[];
  isSaved: (type: TSavedItemType, id: string) => boolean;
  toggleSaved: (type: TSavedItemType, id: string) => void;
  removeSaved: (type: TSavedItemType, id: string) => void;
}

function keyFor(type: TSavedItemType): keyof Pick<
  ISavedItemsState,
  "businesses" | "places" | "events" | "best-of"
> {
  if (type === "business") return "businesses";
  if (type === "place") return "places";
  if (type === "event") return "events";
  return "best-of";
}

export const useSavedItemsStore = create<ISavedItemsState>()(
  persist(
    (set, get) => ({
      businesses: [],
      places: [],
      events: [],
      "best-of": [],
      isSaved: (type, id) => get()[keyFor(type)].includes(id),
      toggleSaved: (type, id) => {
        const key = keyFor(type);
        const list = get()[key];
        const isCurrentlySaved = list.includes(id);
        const next = isCurrentlySaved
          ? list.filter((x) => x !== id)
          : [...list, id];
        set({ [key]: next });
        void syncSavedItem(type, id, !isCurrentlySaved);
      },
      removeSaved: (type, id) => {
        const key = keyFor(type);
        set({ [key]: get()[key].filter((x) => x !== id) });
        void syncSavedItem(type, id, false);
      },
    }),
    {
      name: "jevan-hana-saved",
      storage: createJSONStorage(() => storage),
    },
  ),
);
