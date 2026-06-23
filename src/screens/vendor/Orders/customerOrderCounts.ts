import type { BackendOrder } from '../../../api/orderApi';
import type { VendorOrderListItem } from './orderDetailMapper';

export type VendorCustomerOrderCount = {
  id: string;
  customerName: string;
  orderCount: number;
};

function resolveBuyerKey(order: BackendOrder, fallbackName: string): string {
  const user = order.userId;
  if (user && typeof user === 'object' && user._id) {
    return String(user._id);
  }
  if (typeof user === 'string' && user.trim()) {
    return user.trim();
  }
  return `name:${fallbackName.trim().toLowerCase()}`;
}

export function aggregateApprovedOrdersByCustomer(
  orders: VendorOrderListItem[],
): VendorCustomerOrderCount[] {
  const counts = new Map<string, VendorCustomerOrderCount>();

  for (const order of orders) {
    if (order.status !== 'Order Approved') continue;

    const customerName = order.customerName.trim() || 'Customer';
    const id = resolveBuyerKey(order.backendOrder, customerName);
    const existing = counts.get(id);

    if (existing) {
      existing.orderCount += 1;
    } else {
      counts.set(id, { id, customerName, orderCount: 1 });
    }
  }

  return [...counts.values()].sort((a, b) => {
    const byCount = b.orderCount - a.orderCount;
    if (byCount !== 0) return byCount;
    return a.customerName.localeCompare(b.customerName, undefined, { sensitivity: 'base' });
  });
}
