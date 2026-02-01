export type OrderStatus = 'Delivered' | 'Processing' | 'Cancelled';

export interface OrderItemEntry {
  name: string;
  quantity: number;
  price: string;
  image?: string;
}

export interface OrderEntry {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItemEntry[];
  total: string;
}

export const DUMMY_ORDERS: OrderEntry[] = [
  {
    id: 'EVG2023-001',
    date: 'Dec 15, 2023',
    status: 'Delivered',
    items: [
      { name: 'Luxury Gift Box Set', quantity: 1, price: 'PKR 13,997.20', image: 'https://picsum.photos/seed/giftbox/80/80' },
      { name: 'Personalized Greeting Card', quantity: 1, price: 'PKR 1,400.00', image: 'https://picsum.photos/seed/greeting-card/80/80' },
    ],
    total: 'PKR 15,397.20',
  },
  {
    id: 'EVG2023-002',
    date: 'Nov 28, 2023',
    status: 'Processing',
    items: [
      { name: 'Custom Engraved Watch', quantity: 1, price: 'PKR 55,997.20', image: 'https://picsum.photos/seed/watch/80/80' },
    ],
    total: 'PKR 55,997.20',
  },
  {
    id: 'EVG2023-003',
    date: 'Oct 01, 2023',
    status: 'Cancelled',
    items: [
      { name: 'Exclusive Leather Wallet', quantity: 1, price: 'PKR 21,000.00', image: 'https://picsum.photos/seed/wallet/80/80' },
      { name: 'Premium Espresso Beans', quantity: 2, price: 'PKR 8,680.00', image: 'https://picsum.photos/seed/espresso-beans/80/80' },
    ],
    total: 'PKR 29,680.00',
  },
  {
    id: 'EVG2023-004',
    date: 'Sep 10, 2023',
    status: 'Delivered',
    items: [
      { name: 'Designer Coffee Mug', quantity: 4, price: 'PKR 14,548.80', image: 'https://picsum.photos/seed/coffee-mug/80/80' },
    ],
    total: 'PKR 14,548.80',
  },
];
