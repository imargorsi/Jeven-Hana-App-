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
 * App image fallbacks — only from `assets/images/`.
 * Do not reference deleted `screens/` or `dummy/` folders.
 */
const FALLBACK = require("../../assets/images/jevenhana-fallback.png");
const LOGO = require("../../assets/images/logo.png");
const AUTH_BG = require("../../assets/images/auth-bg.png");

/** Placeholder images for mocks / missing remote covers. */
export const IMG = {
  cafe: FALLBACK,
  restaurant: FALLBACK,
  park: FALLBACK,
  mosque: FALLBACK,
  grocery: FALLBACK,
  event: FALLBACK,
  chai: FALLBACK,
  barber: FALLBACK,
  community: FALLBACK,
  street: AUTH_BG,
  /** Prefer Avatar initials when a user has no photo (do not use for people). */
  avatar: LOGO,
  logo: LOGO,
  /** Business / listing / about cover when no remote image. */
  businessFallback: FALLBACK,
} as const;
