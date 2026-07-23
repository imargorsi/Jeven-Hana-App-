import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";

import { isClerkConfigured } from "@/features/auth/auth.config";
import { href } from "@/lib/navigation.utils";

type TRequireAuth = {
  requireAuth: (action?: () => void) => boolean;
  isSignedIn: boolean;
  isLoaded: boolean;
};

/**
 * Gate account-only actions. Guests can browse; interactive actions
 * send them to sign up. `isClerkConfigured` is build-time stable.
 */
export function useRequireAuth(): TRequireAuth {
  const router = useRouter();

  if (!isClerkConfigured) {
    return {
      isSignedIn: true,
      isLoaded: true,
      requireAuth: (action?: () => void) => {
        action?.();
        return true;
      },
    };
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks -- clerk key is fixed for the app session
  const { isSignedIn, isLoaded } = useAuth();

  const requireAuth = (action?: () => void): boolean => {
    if (!isLoaded) {
      return false;
    }

    if (isSignedIn) {
      action?.();
      return true;
    }

    router.push(href("/register"));
    return false;
  };

  return {
    requireAuth,
    isSignedIn: Boolean(isSignedIn),
    isLoaded: Boolean(isLoaded),
  };
}
