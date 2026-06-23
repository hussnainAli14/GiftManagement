import type { BackendOrder, OrderUserRef } from '../../../api/orderApi';
import { API_ORIGIN } from '../../../api/config';
import type { OrderDetailItem, VendorOrderDetail } from './OrderDetails/types';
import { getOrderCity } from './orderCity';
import { formatEnglishUserAddress, getEnglishCityForUser } from '../../../utils/formatEnglishUserAddress';

export type OrderStatus =
  | 'Placed'
  | 'Order Approved'
  | 'Completed'
  | 'Delivered'
  | 'Cancelled'
  | 'Processing';

export type VendorOrderListItem = {
  id: string;
  orderId: string;
  customerName: string;
  city: string;
  total: string;
  totalAmount: number;
  status: OrderStatus;
  imageUri?: string | number;
  backendOrder: BackendOrder;
};

function resolveImageUri(raw: unknown): string | undefined {
  const s = String(raw || '').trim();
  if (!s) return undefined;
  if (s.startsWith('/')) return `${API_ORIGIN}${s}`;
  return s;
}

function formatPKR(amount: number | undefined): string {
  const n = typeof amount === 'number' && Number.isFinite(amount) ? amount : 0;
  return `PKR ${n.toFixed(2)}`;
}

export function toUiStatus(status: BackendOrder['status']): OrderStatus {
  const s = String(status || '').toLowerCase();
  if (s === 'delivered') return 'Delivered';
  if (s === 'approved') return 'Order Approved';
  if (s === 'pending') return 'Placed';
  if (s === 'completed') return 'Completed';
  if (s === 'cancelled') return 'Cancelled';
  return 'Processing';
}

function shortOrderId(id: string): string {
  const s = String(id || '');
  return s.length > 6 ? s.slice(-6).toUpperCase() : s.toUpperCase();
}

function getUserRef(user: OrderUserRef | string | undefined): OrderUserRef | undefined {
  if (!user || typeof user !== 'object') return undefined;
  return user;
}

function formatOrderDate(createdAt?: string): string {
  if (!createdAt) return '—';
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getStoredCustomer(order: BackendOrder) {
  const name =
    String(order.customerName || order.customerDetails?.name || '').trim();
  const email =
    String(order.customerEmail || order.customerDetails?.email || '').trim();
  const phone =
    String(order.customerPhone || order.customerDetails?.phone || '').trim();
  const address =
    String(order.customerAddress || order.customerDetails?.address || '').trim();
  const city =
    String(order.customerCity || order.customerDetails?.city || '').trim();

  if (!name && !email && !phone && !address && !city) {
    return null;
  }

  return { name, email, phone, address, city };
}

export function mapOrderToListItem(o: BackendOrder): VendorOrderListItem {
  const id = String(o._id || '');
  const buyer = getUserRef(o.userId);
  const stored = getStoredCustomer(o);

  const firstItem = o.items?.[0];
  const firstProduct =
    firstItem && typeof firstItem.productId === 'object' && firstItem.productId
      ? firstItem.productId
      : undefined;
  const img = firstProduct?.images?.[0] || firstProduct?.image || firstItem?.image;

  const buyerCity = stored?.city || getEnglishCityForUser(buyer);
  const fallbackCity = getOrderCity(o);

  return {
    id,
    orderId: shortOrderId(id),
    customerName: stored?.name || buyer?.name?.trim() || 'Customer',
    city: buyerCity !== '—' ? buyerCity : fallbackCity,
    total: formatPKR(o.totalAmount).replace('PKR', 'Rs'),
    totalAmount: typeof o.totalAmount === 'number' && Number.isFinite(o.totalAmount) ? o.totalAmount : 0,
    status: toUiStatus(o.status),
    imageUri: resolveImageUri(img),
    backendOrder: o,
  };
}

export function mapOrderToDetail(order: BackendOrder, listItem?: VendorOrderListItem): VendorOrderDetail {
  const buyer = getUserRef(order.userId);
  const stored = getStoredCustomer(order);

  const items: OrderDetailItem[] = (order.items ?? []).map((item, index) => {
    const product =
      item.productId && typeof item.productId === 'object' ? item.productId : undefined;
    const name = product?.name || item.title || 'Item';
    const unitPrice =
      typeof item.price === 'number'
        ? item.price
        : typeof product?.price === 'number'
          ? product.price
          : 0;
    const quantity = item.quantity ?? 1;

    return {
      id: String(item.productId && typeof item.productId === 'object' ? item.productId._id : index),
      name,
      quantity,
      price: formatPKR(unitPrice * quantity),
      imageUri: resolveImageUri(product?.images?.[0] || product?.image || item.image),
    };
  });

  const subtotalAmount =
    order.items?.reduce((sum, item) => {
      const product =
        item.productId && typeof item.productId === 'object' ? item.productId : undefined;
      const unitPrice =
        typeof item.price === 'number'
          ? item.price
          : typeof product?.price === 'number'
            ? product.price
            : 0;
      return sum + unitPrice * (item.quantity ?? 1);
    }, 0) ?? order.totalAmount ?? 0;

  const totalAmount = order.totalAmount ?? subtotalAmount;
  const listStatus = listItem?.status ?? toUiStatus(order.status);

  const buyerAddress = stored?.address || formatEnglishUserAddress(buyer);
  const buyerCity = stored?.city || getEnglishCityForUser(buyer);
  const customerAddress =
    buyerAddress !== '—'
      ? buyerAddress
      : buyerCity !== '—'
        ? `${buyerCity}, Pakistan`
        : '—';
  const shippingContact =
    String(order.deliveryRecipientName || order.customerDetails?.deliveryRecipientName || '').trim() ||
    stored?.name ||
    buyer?.name?.trim() ||
    'Customer';

  return {
    order: listItem ?? {
      id: String(order._id),
      orderId: shortOrderId(String(order._id)),
      customerName: shippingContact,
      city: getOrderCity(order),
      total: formatPKR(totalAmount).replace('PKR', 'Rs'),
      status: listStatus,
      backendOrder: order,
    },
    orderDate: formatOrderDate(order.createdAt),
    customerName: shippingContact,
    shippingAddress: customerAddress,
    email: stored?.email || buyer?.email?.trim() || '—',
    phone: stored?.phone || buyer?.phone?.trim() || '—',
    items,
    subtotal: formatPKR(subtotalAmount),
    shipping: formatPKR(0),
    tax: formatPKR(0),
    total: formatPKR(totalAmount),
  };
}
