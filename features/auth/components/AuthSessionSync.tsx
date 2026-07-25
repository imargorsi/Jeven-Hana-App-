import { useAuth } from "@clerk/expo";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { useMe } from "@/features/auth/useMe.hook";
import { useSavedItemsStore } from "@/stores/useSavedItemsStore";

/**
 * Mount inside ClerkProvider. When signed in, hits GET /api/v1/auth/me
 * so Neon Users stays in sync (role, name, imageUrl).
 * Also scopes local saved bookmarks + clears user-specific query caches
 * when the Clerk user changes.
 */
export function AuthSessionSync() {
  useMe();

  const { userId, isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const setCurrentUserId = useSavedItemsStore((s) => s.setCurrentUserId);
  const previousUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const applyUser = () => {
      const nextId = isSignedIn && userId ? userId : null;
      setCurrentUserId(nextId);

      if (
        previousUserId.current !== undefined &&
        previousUserId.current !== nextId
      ) {
        void queryClient.removeQueries({ queryKey: ["my-posts"] });
        void queryClient.removeQueries({ queryKey: ["events-going"] });
        void queryClient.removeQueries({ queryKey: ["saved-item"] });
        void queryClient.removeQueries({ queryKey: ["notifications"] });
      }

      previousUserId.current = nextId;
    };

    applyUser();

    const unsub = useSavedItemsStore.persist.onFinishHydration(() => {
      applyUser();
    });

    return unsub;
  }, [isSignedIn, userId, queryClient, setCurrentUserId]);

  return null;
}
