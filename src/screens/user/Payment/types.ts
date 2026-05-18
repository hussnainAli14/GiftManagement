export interface PaymentParams {
  amount: number;
  description: string;
  isFullGift?: boolean;
  /** When true, success screen is ContributionSuccess */
  isContribution?: boolean;
  /** Passed to ContributionSuccess for Back to Wishlist */
  eventTitle?: string;
  /** Wishlist item to fulfill and record as an order */
  wishlistItemId?: string;
  vendorId?: string;
  vendorName?: string;
  campaignId?: string;
  /** Friend paying their campaign pledge (approval happens after payment). */
  isFriendCampaignPledge?: boolean;
  /** Top up the signed-in user's wallet after card payment. */
  isWalletTopUp?: boolean;
  /** Pay to another user's wallet (card payment, credits recipient). */
  isPayToWallet?: boolean;
  payToWalletRecipientId?: string;
  eventId?: string;
}

export type PaymentMethod = 'card' | 'google_pay' | 'apple_pay' | 'other_wallet';
