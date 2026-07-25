import type { ImageSource } from "expo-image";

import type { TAppImage } from "@/types/common.types";

export type { TAppImage };

/** Simulated network delay for mock services. */
export function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function paginate<T>(
  items: T[],
  cursor: string | null | undefined,
  limit = 20,
): { items: T[]; nextCursor: string | null; total: number } {
  const start = cursor ? Number(cursor) : 0;
  const slice = items.slice(start, start + limit);
  const next = start + limit < items.length ? String(start + limit) : null;
  return { items: slice, nextCursor: next, total: items.length };
}

/** Normalize for expo-image `source`. */
export function toImageSource(image: TAppImage): ImageSource | number {
  if (typeof image === "number") {
    return image;
  }
  return { uri: image };
}

/**
 * Local dummy images — relative requires (reliable with Metro).
 * Copied from `screens/dummy` into `assets/images/dummy`.
 */
export const DUMMY = {
  a: require("../../assets/images/dummy/hq720.jpg"),
  b: require("../../assets/images/dummy/7spz4y1t9s771.jpg"),
  c: require("../../assets/images/dummy/Blog-cover.jpg"),
} as const;

/** Placeholder images — local dummies for now. */
export const IMG = {
  cafe: DUMMY.a,
  restaurant: DUMMY.b,
  park: DUMMY.c,
  mosque: DUMMY.a,
  grocery: DUMMY.b,
  event: DUMMY.c,
  chai: DUMMY.a,
  barber: DUMMY.b,
  community: DUMMY.c,
  /** Legacy — prefer Avatar initials when a user has no photo (do not use for people). */
  avatar: require("../../assets/images/logo.png"),
  street: DUMMY.b,
  logo: require("../../assets/images/logo.png"),
  /** Business / listing cover when no `coverImageUrl`. */
  businessFallback: require("../../assets/images/jevenhana-fallback.png"),
} as const;
