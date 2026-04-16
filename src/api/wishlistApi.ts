import { apiRequest } from './http';

export type WishlistItemModel = {
  _id: string;
  title: string;
  description?: string;
  link?: string;
  productName?: string;
  price?: number;
  image?: string;
  contributedAmount?: number;
  targetAmount?: number;
  contributionTarget?: number;
  contributionProgress?: number;
  isContributable?: boolean;
  // Backend schema uses `allowsContribution`
  allowsContribution?: boolean;
  category?: string;
  status?: string;
};

export type WishlistModel = {
  _id: string;
  userId?: { _id: string; name?: string; email?: string };
  eventId?: {
    _id: string;
    name?: string;
    date?: string;
  };
  items: WishlistItemModel[];
};

type WishlistResponse = {
  success: boolean;
  message?: string;
  data: WishlistModel | null;
};

export async function getWishlistByEventApi(eventId: string): Promise<WishlistModel | null> {
  const response = await apiRequest<WishlistResponse>(`/wishlists/event/${eventId}`, { auth: true });
  return response.data ?? null;
}

export async function createWishlistApi(eventId: string): Promise<WishlistModel> {
  const response = await apiRequest<WishlistResponse>('/wishlists', {
    method: 'POST',
    auth: true,
    body: { eventId },
  });
  if (!response.data) {
    throw new Error(response.message || 'Failed to create wishlist');
  }
  return response.data;
}

export async function addWishlistItemApi(input: {
  eventId: string;
  title: string;
  price: number;
  category?: string;
  isContributable?: boolean;
  image?: string;
}): Promise<WishlistModel> {
  const response = await apiRequest<WishlistResponse>('/wishlists/add-item', {
    method: 'POST',
    auth: true,
    body: {
      eventId: input.eventId,
      item: {
        title: input.title,
        productName: input.title,
        price: input.price,
        category: input.category,
        // Backend schema uses `allowsContribution`
        allowsContribution: input.isContributable ?? true,
        image: input.image,
      },
    },
  });
  if (!response.data) {
    throw new Error(response.message || 'Failed to add item');
  }
  return response.data;
}

export async function updateWishlistItemApi(input: {
  itemId: string;
  title: string;
  price: number;
  category?: string;
  allowsContribution: boolean;
  image?: string;
}): Promise<WishlistModel> {
  const response = await apiRequest<WishlistResponse>(`/wishlists/item/${input.itemId}`, {
    method: 'PUT',
    auth: true,
    body: {
      title: input.title,
      price: input.price,
      category: input.category,
      allowsContribution: input.allowsContribution,
      image: input.image,
    },
  });

  if (!response.data) {
    throw new Error(response.message || 'Failed to update wishlist item');
  }
  return response.data;
}

export async function deleteWishlistItemApi(itemId: string): Promise<void> {
  await apiRequest(`/wishlists/item/${itemId}`, {
    method: 'DELETE',
    auth: true,
  });
}
