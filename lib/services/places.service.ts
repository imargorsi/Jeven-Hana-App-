import { delay, paginate } from "@/data/mocks/mock.utils";
import { places } from "@/data/mocks/places.mock";
import type { IPaginatedResult } from "@/types/common.types";
import type { IPlace, TPlaceCategorySlug } from "@/types/place.types";

export async function getPlaces(params?: {
  categorySlug?: TPlaceCategorySlug;
  query?: string;
  nearbyOnly?: boolean;
  cursor?: string | null;
  limit?: number;
}): Promise<IPaginatedResult<IPlace>> {
  await delay();
  let list = [...places];

  if (params?.categorySlug) {
    list = list.filter((p) => p.categorySlug === params.categorySlug);
  }
  if (params?.nearbyOnly) {
    list = list.filter((p) => p.isNearby);
  }
  if (params?.query?.trim()) {
    const q = params.query.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }

  return paginate(list, params?.cursor, params?.limit ?? 20);
}

export async function getPlaceById(id: string): Promise<IPlace | null> {
  await delay();
  return places.find((p) => p.id === id) ?? null;
}
