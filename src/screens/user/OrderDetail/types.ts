import type { OrderEntry } from '../MyOrders/types';

export interface OrderDetailParams {
  order: OrderEntry;
}

export interface StatusStep {
  label: string;
  icon: string;
  completed: boolean;
  dateTime: string;
}

export const DEFAULT_VENDOR = {
  name: 'GiftHub Emporium',
  address: 'Rawalpindi, Asghar Mall Scheme, 11 Street',
  email: 'support@gifthub.com',
};

export const DEFAULT_DELIVERY = {
  address: 'Plot No. 13 Theme Park Avenue, Phase 7, Bahria Town, Rawalpindi.',
  timeRange: 'October 26th, between 4:00 PM - 5:00 PM',
};

export const DEFAULT_PAYMENT = {
  method: 'Credit Card (Visa ending in 4242)',
};

/** Timeline derived from order status for Order Detail. */
export function getOrderTimeline(order: OrderEntry): StatusStep[] {
  const raw = (order.rawStatus ?? '').toLowerCase();
  const isCancelled = order.status === 'Cancelled' || raw === 'cancelled';
  const isDelivered =
    order.status === 'Delivered' || raw === 'delivered' || raw === 'completed';
  const isApproved = raw === 'approved';
  const isPending = raw === 'pending' || (!raw && order.status === 'Processing');

  if (isCancelled) {
    return [
      { label: 'Order Placed', icon: 'card-giftcard', completed: true, dateTime: order.date },
      { label: 'Cancelled', icon: 'cancel', completed: true, dateTime: 'This order was cancelled' },
    ];
  }

  return [
    {
      label: 'Order Placed',
      icon: 'card-giftcard',
      completed: true,
      dateTime: order.date,
    },
    {
      label: 'Processing',
      icon: 'hourglass-empty',
      completed: isPending || isApproved || isDelivered,
      dateTime: isPending ? 'Waiting for vendor' : order.date,
    },
    {
      label: 'Approved',
      icon: 'check-circle',
      completed: isApproved || isDelivered,
      dateTime: isApproved || isDelivered ? order.date : 'Pending',
    },
    {
      label: 'Delivered',
      icon: 'inventory-2',
      completed: isDelivered,
      dateTime: isDelivered ? order.date : 'Pending',
    },
  ];
}
