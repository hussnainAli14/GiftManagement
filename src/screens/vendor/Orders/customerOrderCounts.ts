import type { BackendOrder } from '../../../api/orderApi';
import type { VendorOrderListItem } from './orderDetailMapper';

export type VendorCustomerOrderCount = {
  id: string;
  customerName: string;
  orderCount: number;
};

export type VendorCustomerOrderTotal = {
  id: string;
  customerName: string;
  orderCount: number;
  totalAmount: number;
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

export function aggregateApprovedCustomerTotalsByAmount(
  orders: VendorOrderListItem[],
): VendorCustomerOrderTotal[] {
  const totals = new Map<string, VendorCustomerOrderTotal>();

  for (const order of orders) {
    if (order.status !== 'Order Approved') continue;

    const customerName = order.customerName.trim() || 'Customer';
    const id = resolveBuyerKey(order.backendOrder, customerName);
    const existing = totals.get(id);

    if (existing) {
      existing.orderCount += 1;
      existing.totalAmount += order.totalAmount;
    } else {
      totals.set(id, {
        id,
        customerName,
        orderCount: 1,
        totalAmount: order.totalAmount,
      });
    }
  }

  return [...totals.values()].sort((a, b) => {
    const byAmount = b.totalAmount - a.totalAmount;
    if (byAmount !== 0) return byAmount;
    return a.customerName.localeCompare(b.customerName, undefined, { sensitivity: 'base' });
  });
}
