import type { PersonsWishlistItemData } from '../../../components/PersonsWishlistItem';
import type { VendorItem } from '../SelectVendor/types';

export interface ConfirmOrderParams {
  item: PersonsWishlistItemData;
  vendor: VendorItem;
  eventTitle?: string;
}

export interface DeliveryInfo {
  recipientName: string;
  address: string;
  estimatedDate: string;
}

export const DEFAULT_DELIVERY: DeliveryInfo = {
  recipientName: 'Raja Hassam',
  address: 'Apartment 4B 123 G8, Islamabad',
  estimatedDate: 'November 25, 2026',
};

/** Parse price string like "PKR 23,649.55" to number */
export function parsePrice(priceStr: string): number {
  const cleaned = priceStr.replace(/^PKR\s*/i, '').replace(/,/g, '').trim();
  return parseFloat(cleaned) || 0;
}
