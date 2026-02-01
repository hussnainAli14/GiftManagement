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

/** Dummy timeline for order detail; in real app would come from API based on order.status */
export function getOrderTimeline(_order: OrderEntry): StatusStep[] {
  return [
    { label: 'Order Placed', icon: 'card-giftcard', completed: true, dateTime: 'Thursday, Oct 26, 10:00 AM' },
    { label: 'Processing', icon: 'card-giftcard', completed: true, dateTime: 'Thursday, Oct 26, 11:30 AM' },
    { label: 'Shipped', icon: 'local-shipping', completed: true, dateTime: 'Thursday, Oct 26, 02:00 PM' },
    { label: 'Out for Delivery', icon: 'local-shipping', completed: false, dateTime: 'Estimated by 05:00 PM' },
    { label: 'Delivered', icon: 'inventory-2', completed: false, dateTime: 'Pending' },
  ];
}
