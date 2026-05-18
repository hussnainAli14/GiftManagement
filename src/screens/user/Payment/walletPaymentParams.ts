/** Params for card checkout that credits a wallet (top-up or pay-to-wallet). */
export function buildWalletPaymentParams(
  input:
    | { mode: 'topup'; amount: number }
    | {
        mode: 'pay_to_wallet';
        amount: number;
        recipientUserId: string;
        eventId?: string;
        eventTitle?: string;
        description: string;
      },
) {
  if (input.mode === 'topup') {
    return {
      amount: input.amount,
      description: 'Wallet top-up',
      isWalletTopUp: true,
      isPayToWallet: false,
      isFullGift: false,
      isContribution: false,
      isFriendCampaignPledge: false,
      payToWalletRecipientId: undefined,
      wishlistItemId: undefined,
      vendorId: undefined,
      vendorName: undefined,
      campaignId: undefined,
      eventId: undefined,
      eventTitle: undefined,
    };
  }

  return {
    amount: input.amount,
    description: input.description,
    isPayToWallet: true,
    payToWalletRecipientId: input.recipientUserId,
    eventId: input.eventId,
    eventTitle: input.eventTitle,
    isWalletTopUp: false,
    isFullGift: false,
    isContribution: false,
    isFriendCampaignPledge: false,
    wishlistItemId: undefined,
    vendorId: undefined,
    vendorName: undefined,
    campaignId: undefined,
  };
}
