export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

/** Inventory at or below this count triggers a low-stock alert (still > 0). */
export const LOW_STOCK_THRESHOLD = 5;

export function getProductInventory(inventory: number | undefined | null): number {
  return typeof inventory === 'number' && Number.isFinite(inventory) ? inventory : 0;
}

export function isProductOutOfStock(inventory: number | undefined | null): boolean {
  return getProductInventory(inventory) <= 0;
}

/** True when stock is between 1 and LOW_STOCK_THRESHOLD (inclusive). */
export function isProductLowStock(inventory: number | undefined | null): boolean {
  const n = getProductInventory(inventory);
  return n > 0 && n <= LOW_STOCK_THRESHOLD;
}

export function stockStatusFromInventory(inventory: number | undefined | null): StockStatus {
  const n = getProductInventory(inventory);
  if (n <= 0) return 'Out of Stock';
  if (n <= LOW_STOCK_THRESHOLD) return 'Low Stock';
  return 'In Stock';
}
