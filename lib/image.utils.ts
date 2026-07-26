import type { ImageSource } from "expo-image";

import type { TAppImage } from "@/types/common.types";

export type { TAppImage };

/** Normalize for expo-image `source`. */
export function toImageSource(image: TAppImage): ImageSource | number {
  if (typeof image === "number") {
    return image;
  }
  return { uri: image };
}

/**
 * App image fallbacks — only from `assets/images/`.
 */
const FALLBACK = require("../assets/images/jevenhana-fallback.png");
const LOGO = require("../assets/images/logo.png");

/** Placeholder images for missing remote covers. */
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
  street: FALLBACK,
  /** Prefer Avatar initials when a user has no photo. */
  avatar: LOGO,
  logo: LOGO,
  /** Business / listing / about cover when no remote image. */
  businessFallback: FALLBACK,
} as const;
