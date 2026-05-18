import { API_ORIGIN } from '../api/config';
import type { ProductModel } from '../api/productApi';

/** Resolve product image URL for display (primary image or first gallery image). */
export function resolveProductImageUri(product: Pick<ProductModel, 'image' | 'images'>): string | undefined {
  const raw = (product.image || product.images?.[0] || '').trim();
  if (!raw) return undefined;
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:')) {
    return raw;
  }
  return raw.startsWith('/') ? `${API_ORIGIN}${raw}` : `${API_ORIGIN}/${raw}`;
}

export function getProductVendorName(product: ProductModel): string | undefined {
  const vendor = product.vendorId;
  if (!vendor || typeof vendor === 'string') return undefined;
  return vendor.businessName || vendor.name;
}
