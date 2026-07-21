import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { storage } from "@/lib/storage.utils";

const MAX_RECENT = 10;

interface ISearchState {
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  removeRecentSearch: (query: string) => void;
}

export const useSearchStore = create<ISearchState>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      addRecentSearch: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        const next = [
          trimmed,
          ...get().recentSearches.filter(
            (q) => q.toLowerCase() !== trimmed.toLowerCase(),
          ),
        ].slice(0, MAX_RECENT);
        set({ recentSearches: next });
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
      removeRecentSearch: (query) =>
        set({
          recentSearches: get().recentSearches.filter((q) => q !== query),
        }),
    }),
    {
      name: "jevan-hana-search",
      storage: createJSONStorage(() => storage),
    },
  ),
);
