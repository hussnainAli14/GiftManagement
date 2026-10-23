import type { ProductModel } from '../api/productApi';

function vendorKey(product: ProductModel): string {
  const vendor = product.vendorId;
  if (!vendor) return 'unknown';
  return typeof vendor === 'object' ? String(vendor._id || 'unknown') : String(vendor);
}

function salesOf(product: ProductModel): number {
  const n = Number(product.salesCount);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/**
 * Per vendor, the product with the highest salesCount (> 0) is Hot.
 * Ties: first by id wins (stable).
 */
export function getHotProductIds(products: ProductModel[]): Set<string> {
  const bestByVendor = new Map<string, { id: string; sales: number }>();

  for (const product of products) {
    const sales = salesOf(product);
    if (sales <= 0 || !product._id) continue;
    const key = vendorKey(product);
    const current = bestByVendor.get(key);
    if (!current || sales > current.sales) {
      bestByVendor.set(key, { id: String(product._id), sales });
    }
  }

  return new Set(Array.from(bestByVendor.values()).map((v) => v.id));
}

export function isHotProduct(product: ProductModel, hotIds: Set<string>): boolean {
  return hotIds.has(String(product._id));
}

/** Sort so Hot / higher sales appear first within a vendor group. */
export function sortProductsHotFirst(products: ProductModel[], hotIds: Set<string>): ProductModel[] {
  return [...products].sort((a, b) => {
    const aHot = hotIds.has(String(a._id)) ? 1 : 0;
    const bHot = hotIds.has(String(b._id)) ? 1 : 0;
    if (aHot !== bHot) return bHot - aHot;
    return salesOf(b) - salesOf(a);
  });
}
