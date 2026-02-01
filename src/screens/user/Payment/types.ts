export interface PaymentParams {
  amount: number;
  description: string;
  isFullGift: boolean;
  /** When true, success screen is ContributionSuccess */
  isContribution?: boolean;
  /** Passed to ContributionSuccess for Back to Wishlist */
  eventTitle?: string;
}

export type PaymentMethod = 'card' | 'google_pay' | 'apple_pay' | 'other_wallet';
