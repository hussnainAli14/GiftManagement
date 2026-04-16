import { apiRequest, unwrapData } from './http';

export type BackendOrder = {
  _id: string;
  userId?: { _id: string; name?: string; email?: string } | string;
  recipientId?: { _id: string; name?: string; email?: string } | string;
  items?: Array<{
    productId?: {
      _id: string;
      name?: string;
      image?: string;
      images?: string[];
      price?: number;
    } | string;
    quantity?: number;
  }>;
  totalAmount?: number;
  status?: 'pending' | 'completed' | 'cancelled' | 'delivered' | string;
  createdAt?: string;
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
