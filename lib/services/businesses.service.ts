import { IMG } from "@/data/mocks/mock.utils";
import type { IApiEnvelope } from "@/features/auth/auth.types";
import { createApiClient, isApiConfigured } from "@/lib/api.client";
import type {
  IBusiness,
  TBusinessCategorySlug,
} from "@/types/business.types";
import {
  BUSINESS_CATEGORIES,
  BUSINESS_CATEGORY_LABELS,
} from "@/types/business.types";
import type { IPaginatedResult } from "@/types/common.types";

type TGetToken = () => Promise<string | null>;

interface IApiBusiness {
  id: number;
  name: string;
  category: string;
  description: string | null;
  address: string;
  phone: string | null;
  whatsapp: string | null;
  coverImageUrl: string | null;
  isKaBest: boolean;
  ratingAvg: number;
  reviewCount: number;
  createdByUserId: number;
  createdAt?: string;
  updatedAt?: string;
}

function requireApi() {
  if (!isApiConfigured()) {
    throw new Error(
      "API is not configured. Set EXPO_PUBLIC_API_URL or run Expo in __DEV__.",
    );
  }
}

function mapBusiness(api: IApiBusiness): IBusiness {
  const cover = api.coverImageUrl?.trim() || null;
  return {
    id: String(api.id),
    name: api.name,
    category: api.category as TBusinessCategorySlug,
    description: api.description,
    address: api.address,
    phone: api.phone,
    whatsapp: api.whatsapp,
    coverImageUrl: cover,
    imageUrls: cover ? [cover] : [IMG.businessFallback],
    rating: Number(api.ratingAvg) || 0,
    reviewCount: api.reviewCount || 0,
    isKaBest: Boolean(api.isKaBest),
    createdByUserId: api.createdByUserId,
    reviews: [],
    hours: [],
  };
}

/**
 * GET /api/v1/businesses — public list.
 * Optional client-side `query` filter (API has category filter only in part 1).
 */
export async function getBusinesses(params?: {
  categorySlug?: TBusinessCategorySlug;
  category?: TBusinessCategorySlug;
  query?: string;
  getToken?: TGetToken;
  limit?: number;
}): Promise<IPaginatedResult<IBusiness>> {
  requireApi();
  const getToken = params?.getToken ?? (async () => null);
  const client = createApiClient(getToken);
  const category = params?.category ?? params?.categorySlug;
  const query = category ? `?category=${category}` : "";
  const { data } = await client.get<
    IApiEnvelope<{ businesses: IApiBusiness[] }>
  >(`/api/v1/businesses${query}`);

  if (!data.success || !data.data?.businesses) {
    throw new Error(data.message || "Failed to load businesses");
  }

  let items = data.data.businesses.map(mapBusiness);

  if (params?.query?.trim()) {
    const q = params.query.trim().toLowerCase();
    items = items.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.description?.toLowerCase().includes(q) ?? false) ||
        b.address.toLowerCase().includes(q),
    );
  }

  if (params?.limit != null) {
    items = items.slice(0, params.limit);
  }

  return {
    items,
    nextCursor: null,
    total: items.length,
  };
}

/** GET /api/v1/businesses/:id */
export async function getBusinessById(
  id: string,
  getToken?: TGetToken,
): Promise<IBusiness | null> {
  requireApi();
  const client = createApiClient(getToken ?? (async () => null));
  try {
    const { data } = await client.get<
      IApiEnvelope<{ business: IApiBusiness }>
    >(`/api/v1/businesses/${id}`);
    if (!data.success || !data.data?.business) return null;
    return mapBusiness(data.data.business);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as { response?: { status?: number } }).response?.status === 404
    ) {
      return null;
    }
    throw error;
  }
}

/** GET /api/v1/businesses/me */
export async function getMyBusinesses(
  getToken: TGetToken,
): Promise<IBusiness[]> {
  requireApi();
  const client = createApiClient(getToken);
  const { data } = await client.get<
    IApiEnvelope<{ businesses: IApiBusiness[] }>
  >("/api/v1/businesses/me");

  if (!data.success || !data.data?.businesses) {
    throw new Error(data.message || "Failed to load your listings");
  }

  return data.data.businesses.map(mapBusiness);
}

export interface IBusinessWriteInput {
  name: string;
  category: TBusinessCategorySlug;
  address: string;
  description?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  coverImageUrl?: string | null;
}

export async function createBusiness(
  input: IBusinessWriteInput,
  getToken: TGetToken,
): Promise<IBusiness> {
  requireApi();
  const client = createApiClient(getToken);
  const { data } = await client.post<
    IApiEnvelope<{ business: IApiBusiness }>
  >("/api/v1/businesses", input);

  if (!data.success || !data.data?.business) {
    throw new Error(data.message || "Failed to create listing");
  }

  return mapBusiness(data.data.business);
}

export async function updateBusiness(
  id: string,
  input: Partial<IBusinessWriteInput>,
  getToken: TGetToken,
): Promise<IBusiness> {
  requireApi();
  const client = createApiClient(getToken);
  const { data } = await client.patch<
    IApiEnvelope<{ business: IApiBusiness }>
  >(`/api/v1/businesses/${id}`, input);

  if (!data.success || !data.data?.business) {
    throw new Error(data.message || "Failed to update listing");
  }

  return mapBusiness(data.data.business);
}

export async function deleteBusiness(
  id: string,
  getToken: TGetToken,
): Promise<IBusiness> {
  requireApi();
  const client = createApiClient(getToken);
  const { data } = await client.delete<
    IApiEnvelope<{ business: IApiBusiness }>
  >(`/api/v1/businesses/${id}`);

  if (!data.success || !data.data?.business) {
    throw new Error(data.message || "Failed to delete listing");
  }

  return mapBusiness(data.data.business);
}

/** POST /api/v1/businesses/:id/ka-best — admin only. */
export async function toggleBusinessKaBest(
  id: string,
  getToken: TGetToken,
): Promise<IBusiness> {
  requireApi();
  const client = createApiClient(getToken);
  const { data } = await client.post<
    IApiEnvelope<{ business: IApiBusiness }>
  >(`/api/v1/businesses/${id}/ka-best`);

  if (!data.success || !data.data?.business) {
    throw new Error(data.message || "Failed to update Ka Best");
  }

  return mapBusiness(data.data.business);
}

export function getBusinessCategoryLabel(
  slug: TBusinessCategorySlug,
): string {
  return BUSINESS_CATEGORY_LABELS[slug] ?? "Business";
}

export function isBusinessCategory(
  value: string,
): value is TBusinessCategorySlug {
  return (BUSINESS_CATEGORIES as string[]).includes(value);
}
