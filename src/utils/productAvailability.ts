/** Vendor-controlled product availability. */
export type ProductAvailabilityStatus =
  | 'active'
  | 'inactive'
  | 'out_of_stock'
  | 'discontinued';

export const PRODUCT_AVAILABILITY_OPTIONS: Array<{
  label: string;
  value: ProductAvailabilityStatus;
}> = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Out of Stock', value: 'out_of_stock' },
  { label: 'Discontinued', value: 'discontinued' },
];

export function normalizeAvailabilityStatus(
  value: string | null | undefined,
  inventory?: number | null,
): ProductAvailabilityStatus {
  const raw = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
  if (
    raw === 'active' ||
    raw === 'inactive' ||
    raw === 'out_of_stock' ||
    raw === 'discontinued'
  ) {
    return raw;
  }
  if (typeof inventory === 'number' && inventory <= 0) return 'out_of_stock';
  return 'active';
}

export function availabilityLabel(status: ProductAvailabilityStatus): string {
  switch (status) {
    case 'inactive':
      return 'Inactive';
    case 'out_of_stock':
      return 'Out of Stock';
    case 'discontinued':
      return 'Discontinued';
    case 'active':
    default:
      return 'Active';
  }
}

/** Customers can browse Active + Out of Stock; only Active is purchasable. */
export function isProductListedForCustomers(
  status: string | null | undefined,
  inventory?: number | null,
): boolean {
  const s = normalizeAvailabilityStatus(status, inventory);
  return s === 'active' || s === 'out_of_stock';
}

export function isProductPurchasable(
  status: string | null | undefined,
  inventory?: number | null,
): boolean {
  return (
    normalizeAvailabilityStatus(status, inventory) === 'active' &&
    Number(inventory || 0) > 0
  );
}
