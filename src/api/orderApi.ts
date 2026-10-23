import { apiRequest, unwrapData } from './http';

export type OrderUserRef = {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  area?: string;
  country?: string;
  address?: { city?: string; state?: string; country?: string };
  location?: { lat?: number; lng?: number; coordinates?: number[] };
  lat?: number;
  lng?: number;
};

export type OrderCustomerDetails = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  deliveryRecipientName?: string;
};

export type BackendOrder = {
  _id: string;
  userId?: OrderUserRef | string;
  recipientId?: OrderUserRef | string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCity?: string;
  deliveryRecipientName?: string;
  customerDetails?: OrderCustomerDetails;
  items?: Array<{
    productId?: {
      _id: string;
      name?: string;
      image?: string;
      images?: string[];
      price?: number;
    } | string;
    title?: string;
    image?: string;
    price?: number;
    quantity?: number;
  }>;
  totalAmount?: number;
  status?: 'pending' | 'approved' | 'completed' | 'cancelled' | 'delivered' | string;
  deliveryReceiptStatus?: 'pending' | 'confirmed' | 'denied' | null;
  deliveryConfirmedAt?: string;
  createdAt?: string;
  giftWrapping?: boolean;
  giftWrappingFee?: number;
  giftMessage?: string;
  digitalGiftCard?: boolean;
  digitalGiftCardFee?: number;
  digitalGiftCardMessage?: string;
  digitalGiftCardTheme?: string | null;
};

type OrderResponse = {
  success: boolean;
  message?: string;
  data?: BackendOrder | BackendOrder[];
};

export async function getMyVendorOrdersApi(): Promise<BackendOrder[]> {
  const res = await apiRequest<OrderResponse | BackendOrder[]>(`/orders/vendor/my`, { auth: true });
  const data = unwrapData<BackendOrder[] | BackendOrder>(res as any);
  return Array.isArray(data) ? data : [data];
}

export async function getApprovedOrdersByCityApi(): Promise<BackendOrder[]> {
  const res = await apiRequest<OrderResponse | BackendOrder[]>(`/orders/vendor/approved-by-city`, {
    auth: true,
  });
  const data = unwrapData<BackendOrder[] | BackendOrder>(res as any);
  return Array.isArray(data) ? data : [data];
}

export async function getVendorOrderByIdApi(orderId: string): Promise<BackendOrder> {
  const res = await apiRequest<OrderResponse>(`/orders/${encodeURIComponent(orderId)}`, { auth: true });
  return unwrapData<BackendOrder>(res);
}

export async function updateVendorOrderStatusApi(
  orderId: string,
  status: 'approved' | 'delivered' | 'cancelled',
): Promise<BackendOrder> {
  const res = await apiRequest<OrderResponse>(`/orders/${encodeURIComponent(orderId)}`, {
    method: 'PUT',
    auth: true,
    body: { status },
  });
  return unwrapData<BackendOrder>(res);
}

export type OrderItemModel = {
  productId?: { _id?: string; name?: string; price?: number; image?: string } | string;
  giftId?: { name?: string; price?: number; image?: string };
  title?: string;
  price?: number;
  image?: string;
  quantity?: number;
  vendorId?: string | { _id?: string };
};

export type OrderModel = {
  _id: string;
  userId?: string | OrderUserRef;
  recipientId?: string | OrderUserRef | null;
  status?: string;
  totalAmount?: number;
  createdAt?: string;
  items?: OrderItemModel[];
  pointsAwarded?: number;
  rewardPointsBalance?: number;
  discountPercent?: number;
  discountAmount?: number;
  couponCode?: string | null;
  pointsRedeemed?: number;
  subtotalBeforeDiscount?: number;
  giftWrapping?: boolean;
  giftWrappingFee?: number;
  digitalGiftCard?: boolean;
  digitalGiftCardFee?: number;
  digitalGiftCardMessage?: string;
  digitalGiftCardTheme?: string | null;
};

export async function getMyOrdersApi(userId: string): Promise<OrderModel[]> {
  const response = await apiRequest<unknown>(`/orders/user/${userId}`, { auth: true });
  const data = unwrapData<OrderModel[] | OrderModel>(response);
  return Array.isArray(data) ? data : [data];
}

export async function createWishlistGiftOrderApi(input: {
  wishlistItemId: string;
  vendorId?: string;
  totalAmount: number;
  giftMessage?: string;
  deliveryRecipientName?: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  customerPhone?: string;
  applyRewardCoupon?: boolean;
  giftWrapping?: boolean;
  digitalGiftCard?: boolean;
  digitalGiftCardMessage?: string;
  digitalGiftCardTheme?: 'classic' | 'birthday' | 'thank_you' | 'celebration';
}): Promise<OrderModel> {
  const response = await apiRequest<unknown>('/orders/wishlist-gift', {
    method: 'POST',
    auth: true,
    body: input,
  });
  return unwrapData<OrderModel>(response);
}

export async function createDirectGiftOrderApi(input: {
  recipientId: string;
  productId: string;
  vendorId?: string;
  totalAmount: number;
  giftMessage?: string;
  deliveryRecipientName?: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  customerPhone?: string;
  applyRewardCoupon?: boolean;
  giftWrapping?: boolean;
  digitalGiftCard?: boolean;
  digitalGiftCardMessage?: string;
  digitalGiftCardTheme?: 'classic' | 'birthday' | 'thank_you' | 'celebration';
}): Promise<OrderModel> {
  const response = await apiRequest<unknown>('/orders/direct-gift', {
    method: 'POST',
    auth: true,
    body: input,
  });
  return unwrapData<OrderModel>(response);
}

export async function createWishlistContributionOrderApi(input: {
  wishlistItemId: string;
  amount: number;
  giftMessage?: string;
  campaignId?: string;
}): Promise<OrderModel> {
  const response = await apiRequest<unknown>('/orders/wishlist-contribution', {
    method: 'POST',
    auth: true,
    body: input,
  });
  return unwrapData<OrderModel>(response);
}

/** Orders between the current user and `userId` (gift buyer ↔ recipient). */
export async function getGiftHistoryWithUserApi(userId: string): Promise<OrderModel[]> {
  const response = await apiRequest<unknown>(`/orders/with-user/${userId}`, { auth: true });
  const data = unwrapData<OrderModel[] | OrderModel>(response);
  return Array.isArray(data) ? data : [data];
}

export async function getOrderByIdApi(orderId: string): Promise<BackendOrder> {
  const res = await apiRequest<OrderResponse>(`/orders/${encodeURIComponent(orderId)}`, { auth: true });
  return unwrapData<BackendOrder>(res);
}

/** Recipient confirms (Yes) or denies (No) that they received the delivered order. */
export async function confirmDeliveryReceiptApi(
  orderId: string,
  confirmed: boolean,
): Promise<BackendOrder> {
  const res = await apiRequest<OrderResponse>(
    `/orders/${encodeURIComponent(orderId)}/confirm-delivery`,
    {
      method: 'POST',
      auth: true,
      body: { confirmed },
    },
  );
  return unwrapData<BackendOrder>(res);
}

/** Buyer cancels a pending order. */
export async function cancelOrderApi(orderId: string): Promise<BackendOrder> {
  const res = await apiRequest<OrderResponse>(
    `/orders/${encodeURIComponent(orderId)}/cancel`,
    {
      method: 'POST',
      auth: true,
    },
  );
  return unwrapData<BackendOrder>(res);
}
