import {
  businessCategories,
  businesses,
} from "@/data/mocks/businesses.mock";
import { delay, paginate } from "@/data/mocks/mock.utils";
import type { IBusiness, IBusinessCategory, TBusinessCategorySlug } from "@/types/business.types";
import type { IPaginatedResult } from "@/types/common.types";

export async function getBusinessCategories(): Promise<IBusinessCategory[]> {
  await delay();
  return businessCategories;
}

export async function getBusinesses(params?: {
  categorySlug?: TBusinessCategorySlug;
  query?: string;
  featuredOnly?: boolean;
  topRatedOnly?: boolean;
  cursor?: string | null;
  limit?: number;
}): Promise<IPaginatedResult<IBusiness>> {
  await delay();
  let list = [...businesses];

  if (params?.categorySlug) {
    list = list.filter((b) => b.categorySlug === params.categorySlug);
  }
  if (params?.featuredOnly) {
    list = list.filter((b) => b.isFeatured);
  }
  if (params?.topRatedOnly) {
    list = list.filter((b) => b.isTopRated);
  }
  if (params?.query?.trim()) {
    const q = params.query.trim().toLowerCase();
    list = list.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.tags?.some((t) => t.toLowerCase().includes(q)),
    );
  }

  list.sort((a, b) => b.rating - a.rating);
  return paginate(list, params?.cursor, params?.limit ?? 20);
}

export async function getBusinessById(id: string): Promise<IBusiness | null> {
  await delay();
  return businesses.find((b) => b.id === id) ?? null;
}
