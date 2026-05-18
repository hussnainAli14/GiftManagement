import { apiRequest, unwrapData } from './http';

export type WalletTransaction = {
  _id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  kind?: string;
  eventId?: string;
  eventTitle?: string;
  counterpartyName?: string | null;
  createdAt: string;
};

export type UserWallet = {
  balance: number;
  transactions: WalletTransaction[];
};

export async function getMyWalletApi(): Promise<UserWallet> {
  const response = await apiRequest<unknown>('/wallet', { auth: true });
  return unwrapData<UserWallet>(response);
}

export async function topUpWalletApi(amount: number): Promise<{ balance: number }> {
  const response = await apiRequest<unknown>('/wallet/topup', {
    method: 'POST',
    auth: true,
    body: { amount },
  });
  return unwrapData<{ balance: number }>(response);
}

export async function payToWalletApi(input: {
  recipientUserId: string;
  amount: number;
  eventId?: string;
  eventTitle?: string;
}): Promise<{ recipientBalance: number }> {
  const response = await apiRequest<unknown>('/wallet/pay-to-wallet', {
    method: 'POST',
    auth: true,
    body: input,
  });
  return unwrapData<{ recipientBalance: number }>(response);
}
