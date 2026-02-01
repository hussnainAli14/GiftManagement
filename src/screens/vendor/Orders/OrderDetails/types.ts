import type { OrderStatus, VendorOrderItem } from '../Orders';

export type OrderDetailItem = {
  id: string;
  name: string;
  quantity: number;
  price: string;
  imageUri?: string | number;
};

export type VendorOrderDetail = {
  order: VendorOrderItem;
  orderDate: string;
  customerName: string;
  shippingAddress: string;
  email: string;
  phone: string;
  items: OrderDetailItem[];
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
};

export type OrderDetailsScreenParams = {
  order: VendorOrderItem;
  detail?: VendorOrderDetail;
};
