import { apiRequest, unwrapData } from './http';

export type OrderItemModel = {
  productId?: { name?: string; price?: number; image?: string };
  giftId?: { name?: string; price?: number; image?: string };
  quantity?: number;
  price?: number;
};

export type OrderUserRef = { _id?: string; name?: string; email?: string };

export type OrderModel = {
  _id: string;
  userId?: string | OrderUserRef;
  recipientId?: string | OrderUserRef | null;
  status?: string;
  totalAmount?: number;
  createdAt?: string;
  items?: OrderItemModel[];
};

export async function getMyOrdersApi(userId: string): Promise<OrderModel[]> {
  const response = await apiRequest<unknown>(`/orders/user/${userId}`, { auth: true });
  const data = unwrapData<OrderModel[] | OrderModel>(response);
  return Array.isArray(data) ? data : [data];
}

/** Orders between the current user and `userId` (gift buyer ↔ recipient). */
export async function getGiftHistoryWithUserApi(userId: string): Promise<OrderModel[]> {
  const response = await apiRequest<unknown>(`/orders/with-user/${userId}`, { auth: true });
  const data = unwrapData<OrderModel[] | OrderModel>(response);
  return Array.isArray(data) ? data : [data];
}
