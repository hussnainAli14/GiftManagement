import type { BackendOrder } from '../../../api/orderApi';

function extractCityFromUser(user: BackendOrder['userId'] | BackendOrder['recipientId']): string {
  if (!user || typeof user !== 'object') return '';
  const topLevel = String(user.city || '').trim();
  if (topLevel) return topLevel;
  const addressCity = String(user.address?.city || '').trim();
  if (addressCity) return addressCity;
  return '';
}

/** Prefer delivery city on the order, then recipient, then buyer. */
export function getOrderCity(order: BackendOrder): string {
  const deliveryCity = String(order.customerCity || order.customerDetails?.city || '').trim();
  if (deliveryCity) return deliveryCity;

  const recipientCity = extractCityFromUser(order.recipientId);
  if (recipientCity) return recipientCity;
  const buyerCity = extractCityFromUser(order.userId);
  if (buyerCity) return buyerCity;
  return 'Unknown';
}

export function compareCitiesAsc(a: string, b: string): number {
  const cityA = a.trim() || 'Unknown';
  const cityB = b.trim() || 'Unknown';
  if (cityA.toLowerCase() === 'unknown' && cityB.toLowerCase() !== 'unknown') return 1;
  if (cityB.toLowerCase() === 'unknown' && cityA.toLowerCase() !== 'unknown') return -1;
  return cityA.localeCompare(cityB, undefined, { sensitivity: 'base' });
}
