import type { IApiEnvelope } from "@/features/auth/auth.types";
import { createApiClient, isApiConfigured } from "@/lib/api.client";
import type { IReview, IReviewAuthor } from "@/types/common.types";

type TGetToken = () => Promise<string | null>;

interface IApiReviewAuthor {
  id: number;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  role: "user" | "admin";
}

interface IApiReview {
  id: number;
  businessId: number;
  rating: number;
  comment: string;
  createdByUserId: number;
  authorName: string;
  authorAvatarUrl: string | null;
  author: IApiReviewAuthor | null;
  createdAt: string;
  updatedAt?: string;
}

interface IReviewMutationResult {
  review: IReview;
  ratingAvg: number;
  reviewCount: number;
}

interface IReviewDeleteResult {
  businessId: string;
  ratingAvg: number;
  reviewCount: number;
}

function requireApi() {
  if (!isApiConfigured()) {
    throw new Error(
      "API is not configured. Set EXPO_PUBLIC_API_URL or run Expo in __DEV__.",
    );
  }
}

function mapAuthor(api: IApiReviewAuthor | null): IReviewAuthor | null {
  if (!api) return null;
  return {
    id: api.id,
    firstName: api.firstName,
    lastName: api.lastName,
    imageUrl: api.imageUrl,
    role: api.role,
  };
}

function mapReview(api: IApiReview): IReview {
  return {
    id: String(api.id),
    businessId: String(api.businessId),
    rating: api.rating,
    comment: api.comment,
    createdByUserId: api.createdByUserId,
    authorName: api.authorName || "Neighbour",
    authorAvatarUrl: api.authorAvatarUrl?.trim() || undefined,
    author: mapAuthor(api.author),
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

/** GET /api/v1/businesses/:id/reviews — public */
export async function getBusinessReviews(
  businessId: string,
  getToken?: TGetToken,
): Promise<IReview[]> {
  requireApi();
  const client = createApiClient(getToken ?? (async () => null));
  const { data } = await client.get<IApiEnvelope<{ reviews: IApiReview[] }>>(
    `/api/v1/businesses/${businessId}/reviews`,
  );

  if (!data.success || !data.data?.reviews) {
    throw new Error(data.message || "Failed to load reviews");
  }

  return data.data.reviews.map(mapReview);
}

export interface IReviewWriteInput {
  rating: number;
  comment: string;
}

/** POST /api/v1/businesses/:id/reviews */
export async function createBusinessReview(
  businessId: string,
  input: IReviewWriteInput,
  getToken: TGetToken,
): Promise<IReviewMutationResult> {
  requireApi();
  const client = createApiClient(getToken);
  const { data } = await client.post<
    IApiEnvelope<{
      review: IApiReview;
      ratingAvg: number;
      reviewCount: number;
    }>
  >(`/api/v1/businesses/${businessId}/reviews`, input);

  if (!data.success || !data.data?.review) {
    throw new Error(data.message || "Failed to post review");
  }

  return {
    review: mapReview(data.data.review),
    ratingAvg: Number(data.data.ratingAvg) || 0,
    reviewCount: data.data.reviewCount || 0,
  };
}

/** PATCH /api/v1/reviews/:id */
export async function updateBusinessReview(
  reviewId: string,
  input: Partial<IReviewWriteInput>,
  getToken: TGetToken,
): Promise<IReviewMutationResult> {
  requireApi();
  const client = createApiClient(getToken);
  const { data } = await client.patch<
    IApiEnvelope<{
      review: IApiReview;
      ratingAvg: number;
      reviewCount: number;
    }>
  >(`/api/v1/reviews/${reviewId}`, input);

  if (!data.success || !data.data?.review) {
    throw new Error(data.message || "Failed to update review");
  }

  return {
    review: mapReview(data.data.review),
    ratingAvg: Number(data.data.ratingAvg) || 0,
    reviewCount: data.data.reviewCount || 0,
  };
}

/** DELETE /api/v1/reviews/:id */
export async function deleteBusinessReview(
  reviewId: string,
  getToken: TGetToken,
): Promise<IReviewDeleteResult> {
  requireApi();
  const client = createApiClient(getToken);
  const { data } = await client.delete<
    IApiEnvelope<{
      businessId: number;
      ratingAvg: number;
      reviewCount: number;
    }>
  >(`/api/v1/reviews/${reviewId}`);

  if (!data.success || !data.data) {
    throw new Error(data.message || "Failed to delete review");
  }

  return {
    businessId: String(data.data.businessId),
    ratingAvg: Number(data.data.ratingAvg) || 0,
    reviewCount: data.data.reviewCount || 0,
  };
}
