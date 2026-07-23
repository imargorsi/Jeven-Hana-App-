import {
  businessCategories,
  businesses,
} from "@/data/mocks/businesses.mock";
import { delay, paginate } from "@/data/mocks/mock.utils";
import type {
  IBusiness,
  IBusinessCategory,
  TBusinessCategorySlug,
} from "@/types/business.types";
import type { IPaginatedResult, IReview } from "@/types/common.types";

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

export async function addBusinessReview(
  businessId: string,
  input: {
    authorName: string;
    rating: number;
    comment: string;
  },
): Promise<IBusiness | null> {
  await delay(200);
  const business = businesses.find((b) => b.id === businessId);
  if (!business) return null;

  const rating = Math.max(1, Math.min(5, Math.round(input.rating)));
  const comment = input.comment.trim();
  if (!comment) return null;

  const review: IReview = {
    id: `rev-${businessId}-${Date.now()}`,
    authorName: input.authorName.trim() || "Neighbour",
    rating,
    comment,
    createdAt: new Date().toISOString(),
  };

  business.reviews = [review, ...business.reviews];
  business.reviewCount += 1;

  const totalStars = business.reviews.reduce(
    (sum, item) => sum + item.rating,
    0,
  );
  business.rating =
    Math.round((totalStars / business.reviews.length) * 10) / 10;

  return { ...business };
}

export function getBusinessCategoryLabel(
  slug: TBusinessCategorySlug,
): string {
  return businessCategories.find((c) => c.slug === slug)?.name ?? "Business";
}
