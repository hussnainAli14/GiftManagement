import { apiRequest, unwrapData } from './http';

export type RewardTransaction = {
  _id: string;
  points: number;
  type: 'earn' | 'redeem';
  kind?: string;
  description: string;
  orderId?: string;
  orderAmount?: number;
  createdAt: string;
};

export type UserRewards = {
  balance: number;
  rewardPercent: number;
  discountPercent?: number;
  maxDiscountPercent?: number;
  pointsPerDiscountPercent?: number;
  couponCode?: string | null;
  transactions: RewardTransaction[];
};

export type CheckoutOffer = {
  rewardPoints: number;
  discountPercent: number;
  maxDiscountPercent: number;
  pointsPerDiscountPercent: number;
  pointsCostToRedeem: number;
  couponCode: string | null;
  eligible: boolean;
  pointsToNextPercent: number;
  title: string;
  description: string;
};

export async function getMyRewardsApi(): Promise<UserRewards> {
  const response = await apiRequest<unknown>('/rewards', { auth: true });
  return unwrapData<UserRewards>(response);
}

export async function getCheckoutOfferApi(): Promise<CheckoutOffer> {
  const response = await apiRequest<unknown>('/rewards/checkout-offer', { auth: true });
  return unwrapData<CheckoutOffer>(response);
}
