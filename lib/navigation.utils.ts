import type { Href } from "expo-router";

/** Cast dynamic paths until Expo regenerates typed routes. */
export function href(path: string): Href {
  return path as Href;
}
