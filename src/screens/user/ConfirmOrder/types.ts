import type { PersonsWishlistItemData } from '../../../components/PersonsWishlistItem';
import type { VendorItem } from '../SelectVendor/types';

export interface ConfirmOrderParams {
  item: PersonsWishlistItemData;
  vendor: VendorItem;
  eventTitle?: string;
  directGift?: boolean;
  productId?: string;
  recipientUserId?: string;
  recipientName?: string;
}

/** Parse price string like "PKR 23,649.55" to number */
export function parsePrice(priceStr: string): number {
  const cleaned = priceStr.replace(/^PKR\s*/i, '').replace(/,/g, '').trim();
  return parseFloat(cleaned) || 0;
}
