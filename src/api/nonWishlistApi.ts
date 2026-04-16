import { apiRequest } from './http';

export type NonWishlistItemModel = {
  _id: string;
  title?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
};

export type NonWishlistModel = {
  _id: string;
  userId?: { _id: string; name?: string; email?: string };
  items: NonWishlistItemModel[];
};

type NonWishlistResponse = {
  success: boolean;
  message?: string;
  data: NonWishlistModel | null;
};

export async function getNonWishlistByEventApi(eventId: string): Promise<NonWishlistModel | null> {
  const response = await apiRequest<NonWishlistResponse>(`/non-wishlists/event/${eventId}`, { auth: true });
  return response.data ?? null;
}

export async function addNonWishlistItemApi(input: {
  eventId: string;
  title: string;
  price: number;
  category?: string;
  image?: string;
}): Promise<NonWishlistModel> {
  const response = await apiRequest<NonWishlistResponse>('/non-wishlists/add-item', {
    method: 'POST',
    auth: true,
    body: {
      eventId: input.eventId,
      item: {
        title: input.title,
        price: input.price,
        category: input.category,
        image: input.image,
      },
    },
  });

  if (!response.data) {
    throw new Error(response.message || 'Failed to add non-wishlist item');
  }
  return response.data;
}

export async function updateNonWishlistItemApi(input: {
  itemId: string;
  title: string;
  price: number;
  category?: string;
  image?: string;
}): Promise<NonWishlistModel> {
  const response = await apiRequest<NonWishlistResponse>(`/non-wishlists/item/${input.itemId}`, {
    method: 'PUT',
    auth: true,
    body: {
      title: input.title,
      price: input.price,
      category: input.category,
      image: input.image,
    },
  });

  if (!response.data) {
    throw new Error(response.message || 'Failed to update non-wishlist item');
  }
  return response.data;
}

export async function deleteNonWishlistItemApi(itemId: string): Promise<void> {
  await apiRequest(`/non-wishlists/item/${itemId}`, {
    method: 'DELETE',
    auth: true,
  });
}

