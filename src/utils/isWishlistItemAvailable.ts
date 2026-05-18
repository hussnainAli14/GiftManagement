import type { WishlistItemModel } from '../api/wishlistApi';

/** True when the item can still be gifted or contributed to. */
export function isWishlistItemAvailable(item: WishlistItemModel): boolean {
  if (item.status === 'gifted') return false;

  if (item.allowsContribution) {
    const target = Number(item.contributionTarget ?? item.price ?? 0);
    const progress = Number(item.contributionProgress ?? 0);
    if (target > 0 && progress >= target) return false;
  }

  return true;
}

export function filterAvailableWishlistItems(items: WishlistItemModel[]): WishlistItemModel[] {
  return items.filter(isWishlistItemAvailable);
}

/** Owners see fulfilled items; everyone else only sees items still available to gift/contribute. */
export function filterWishlistItemsForViewer(
  items: WishlistItemModel[],
  isOwner: boolean
): WishlistItemModel[] {
  if (isOwner) return items;
  return filterAvailableWishlistItems(items);
}
