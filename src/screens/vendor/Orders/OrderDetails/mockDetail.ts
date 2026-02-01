import type { VendorOrderDetail } from './types';
import type { VendorOrderItem } from '../Orders';

const PENDING_ORDER_DETAIL: VendorOrderDetail = {
  order: {
    id: '4',
    orderId: 'MC1004',
    customerName: 'Diana Miller',
    total: 'Rs 49.99',
    status: 'Pending',
  },
  orderDate: 'November 21, 2023',
  customerName: 'Aisha Khan',
  shippingAddress: 'House 4, Street 15, Block B, DHA Phase 6, Karachi, Sindh, Pakistan',
  email: 'aisha.khan@example.pk',
  phone: '+92 300 1234567',
  items: [
    { id: '1', name: 'Professional Chef Knife Set', quantity: 1, price: 'PKR 19999.00', imageUri: 'https://picsum.photos/seed/knife-set/96/96' },
    { id: '2', name: 'Automatic Drip Coffee Maker', quantity: 1, price: 'PKR 12500.00', imageUri: 'https://picsum.photos/seed/coffee-maker/96/96' },
    { id: '3', name: 'Organic Green Tea (20 bags)', quantity: 3, price: 'PKR 750.00', imageUri: 'https://picsum.photos/seed/green-tea/96/96' },
  ],
  subtotal: 'PKR 34749.00',
  shipping: 'PKR 1250.00',
  tax: 'PKR 2780.00',
  total: 'PKR 38779.00',
};

export function getOrderDetail(order: VendorOrderItem): VendorOrderDetail {
  if (order.orderId === 'MC1004' || order.status === 'Pending') {
    return {
      ...PENDING_ORDER_DETAIL,
      order,
    };
  }
  return {
    order,
    orderDate: 'November 21, 2023',
    customerName: order.customerName,
    shippingAddress: 'House 4, Street 15, Block B, DHA Phase 6, Karachi, Sindh, Pakistan',
    email: 'customer@example.pk',
    phone: '+92 300 0000000',
    items: [
      { id: '1', name: 'Sample Product', quantity: 1, price: order.total, imageUri: 'https://picsum.photos/seed/product/96/96' },
    ],
    subtotal: order.total,
    shipping: 'PKR 0.00',
    tax: 'PKR 0.00',
    total: order.total,
  };
}
