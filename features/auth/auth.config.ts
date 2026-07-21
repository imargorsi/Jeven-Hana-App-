import Constants from "expo-constants";

function trimKey(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

/**
 * Expo inlines EXPO_PUBLIC_* from .env files. Clerk CLI often writes
 * NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY instead — we pass that through app.config.js extra.
 */
export const clerkPublishableKey = trimKey(
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ??
    (Constants.expoConfig?.extra?.clerkPublishableKey as string | undefined),
);

export const isClerkConfigured = Boolean(clerkPublishableKey);
