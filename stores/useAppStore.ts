import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { storage } from "@/lib/storage.utils";

interface IAppState {
  hasOnboarded: boolean;
  setHasOnboarded: (value: boolean) => void;
}

export const useAppStore = create<IAppState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      setHasOnboarded: (value) => set({ hasOnboarded: value }),
    }),
    {
      name: "jevan-hana-app",
      storage: createJSONStorage(() => storage),
    },
  ),
);
