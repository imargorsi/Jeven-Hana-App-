import { ABOUT_CONTENT_MOCK } from "@/data/mocks/about.mock";
import { delay } from "@/data/mocks/mock.utils";
import type { IAboutContent } from "@/types/about.types";

/**
 * About Us content.
 * Today: local JSON mock. Later: GET /api/v1/about → same IAboutContent shape.
 */
export async function getAboutContent(): Promise<IAboutContent> {
  await delay(200);
  return ABOUT_CONTENT_MOCK;
}
