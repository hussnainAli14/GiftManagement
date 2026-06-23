import type { ProductModel } from '../api/productApi';
import type { WishlistItemModel } from '../api/wishlistApi';
import type { NonWishlistItemModel } from '../api/nonWishlistApi';
import { isWishlistItemAvailable } from './isWishlistItemAvailable';

function normalizeCatalogKey(title: string, price: number): string {
  return `${title.trim().toLowerCase()}|${Number(price) || 0}`;
}

function resolveProductId(item: {
  productId?: string | { _id?: string };
}): string | undefined {
  const ref = item.productId;
  if (!ref) return undefined;
  if (typeof ref === 'string') return ref;
  return ref._id ? String(ref._id) : undefined;
}

export function filterUnaddedCatalogProducts(
  products: ProductModel[],
  wishlistItems: WishlistItemModel[],
  nonWishlistItems: NonWishlistItemModel[],
): ProductModel[] {
  const productIds = new Set<string>();
  const fallbackKeys = new Set<string>();

  wishlistItems.filter(isWishlistItemAvailable).forEach((item) => {
    const productId = resolveProductId(item);
    if (productId) {
      productIds.add(productId);
      return;
    }
    if (item.title) {
      fallbackKeys.add(normalizeCatalogKey(item.title, item.price ?? 0));
    }
  });

  nonWishlistItems.forEach((item) => {
    const productId = resolveProductId(item);
    if (productId) {
      productIds.add(productId);
      return;
    }
    if (item.title) {
      fallbackKeys.add(normalizeCatalogKey(item.title, item.price ?? 0));
    }
  });

  return products.filter((product) => {
    if (productIds.has(product._id)) return false;
    return !fallbackKeys.has(normalizeCatalogKey(product.name, Number(product.price) || 0));
  });
}
