import { ABOUT_CONTENT } from "@/lib/content/about.content";
import type { IAboutContent } from "@/types/about.types";

/**
 * About Us content.
 * Static copy today; later: GET /api/v1/about → same IAboutContent shape.
 */
export async function getAboutContent(): Promise<IAboutContent> {
  return ABOUT_CONTENT;
}
