import { apiRequest, unwrapData } from './http';

export type VendorReview = {
  _id: string;
  userId: string;
  vendorId: string;
  rating: number;
  comment?: string;
  createdAt?: string;
};

export type ContributionPeerReview = {
  _id: string;
  reviewerId: string;
  revieweeId: string;
  campaignId: string;
  rating: number;
  comment?: string;
  createdAt?: string;
};

export type FriendContributionRating = {
  revieweeId: string;
  averageRating: number;
  reviewCount: number;
};

export async function createVendorReviewApi(input: {
  vendorId: string;
  orderId: string;
  rating: number;
  comment?: string;
}): Promise<VendorReview> {
  const response = await apiRequest<unknown>('/reviews', {
    method: 'POST',
    auth: true,
    body: input,
  });
  return unwrapData<VendorReview>(response);
}

export async function getMyVendorReviewForOrderApi(
  orderId: string,
  vendorId?: string,
): Promise<VendorReview | null> {
  const qs = vendorId ? `?vendorId=${encodeURIComponent(vendorId)}` : '';
  const response = await apiRequest<unknown>(
    `/reviews/order/${encodeURIComponent(orderId)}/vendor-mine${qs}`,
    { auth: true },
  );
  return unwrapData<VendorReview | null>(response);
}

export type ProductReview = {
  _id: string;
  userId?: string;
  productId?: string;
  orderId?: string;
  productName?: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  userName?: string;
};

export type ProductReviewsSummary = {
  averageRating: number | null;
  reviewCount: number;
  reviews: ProductReview[];
};

export async function createProductReviewApi(input: {
  orderId: string;
  productId?: string;
  rating: number;
  comment?: string;
}): Promise<ProductReview> {
  const response = await apiRequest<unknown>('/reviews/product', {
    method: 'POST',
    auth: true,
    body: input,
  });
  return unwrapData<ProductReview>(response);
}

export async function getProductReviewsApi(productId: string): Promise<ProductReviewsSummary> {
  const response = await apiRequest<unknown>(`/reviews/product/${encodeURIComponent(productId)}`, {
    auth: false,
  });
  return unwrapData<ProductReviewsSummary>(response);
}

export async function getMyProductReviewForOrderApi(
  orderId: string,
  productId?: string,
): Promise<ProductReview | null> {
  const qs = productId ? `?productId=${encodeURIComponent(productId)}` : '';
  const response = await apiRequest<unknown>(
    `/reviews/order/${encodeURIComponent(orderId)}/mine${qs}`,
    { auth: true },
  );
  return unwrapData<ProductReview | null>(response);
}

export async function createContributionPeerReviewApi(input: {
  campaignId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
}): Promise<ContributionPeerReview> {
  const response = await apiRequest<unknown>('/reviews/contribution-peer', {
    method: 'POST',
    auth: true,
    body: input,
  });
  return unwrapData<ContributionPeerReview>(response);
}

export async function getFriendContributionRatingsApi(
  userIds: string[],
): Promise<FriendContributionRating[]> {
  if (!userIds.length) return [];
  const response = await apiRequest<unknown>(
    `/reviews/contribution-peer/ratings?userIds=${encodeURIComponent(userIds.join(','))}`,
    { auth: true },
  );
  return unwrapData<FriendContributionRating[]>(response);
}

export async function getCampaignPeerReviewsApi(
  campaignId: string,
): Promise<Pick<ContributionPeerReview, 'revieweeId' | 'rating' | 'comment'>[]> {
  const response = await apiRequest<unknown>(
    `/reviews/contribution-peer/campaign/${campaignId}`,
    { auth: true },
  );
  return unwrapData<Pick<ContributionPeerReview, 'revieweeId' | 'rating' | 'comment'>[]>(response);
}

export type ReceivedReviewItem = {
  id: string;
  rating: number;
  comment: string;
  createdAt?: string;
  reviewerName: string;
  contextLabel?: string;
  source: 'vendor' | 'contribution';
};

export type MyReceivedReviews = {
  averageRating: number | null;
  reviewCount: number;
  reviews: ReceivedReviewItem[];
};

export async function getMyReceivedReviewsApi(): Promise<MyReceivedReviews> {
  const response = await apiRequest<unknown>('/reviews/received/me', { auth: true });
  return unwrapData<MyReceivedReviews>(response);
}
