import { bestOfCategories, bestOfListings } from "@/data/mocks/best-of.mock";
import { delay, paginate } from "@/data/mocks/mock.utils";
import type { IBestOfCategory, IBestOfListing, TBestOfCategorySlug } from "@/types/best-of.types";
import type { IPaginatedResult } from "@/types/common.types";

export async function getBestOfCategories(): Promise<IBestOfCategory[]> {
  await delay();
  return bestOfCategories;
}

export async function getBestOfListings(params?: {
  categorySlug?: TBestOfCategorySlug;
  cursor?: string | null;
  limit?: number;
}): Promise<IPaginatedResult<IBestOfListing>> {
  await delay();
  let list = [...bestOfListings];
  if (params?.categorySlug) {
    list = list.filter((l) => l.categorySlug === params.categorySlug);
  }
  list.sort((a, b) => a.rank - b.rank);
  return paginate(list, params?.cursor, params?.limit ?? 20);
}

export async function getBestOfById(id: string): Promise<IBestOfListing | null> {
  await delay();
  return bestOfListings.find((l) => l.id === id) ?? null;
}
