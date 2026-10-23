import type { BackendOrder } from '../../../../api/orderApi';
import type { OrderStatus, VendorOrderListItem } from '../orderDetailMapper';

export type VendorOrderItem = VendorOrderListItem;

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
  giftWrapping?: boolean;
  giftWrappingFee?: string;
  digitalGiftCard?: boolean;
  digitalGiftCardFee?: string;
  digitalGiftCardMessage?: string;
  digitalGiftCardTheme?: string | null;
};

export type OrderDetailsScreenParams = {
  order: VendorOrderItem;
  backendOrder: BackendOrder;
};
