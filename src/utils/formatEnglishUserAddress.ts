import {
  getEnglishAddressNearCoordinates,
  getNearestPakistanCity,
  matchPakistanCityByName,
  PAKISTAN_CITY_DROPDOWN_OPTIONS,
} from '../data/pakistanCities';

export type UserAddressFields = {
  city?: string;
  area?: string;
  country?: string;
  address?: { city?: string; state?: string; country?: string };
  location?: { lat?: number; lng?: number; coordinates?: number[] };
  lat?: number;
  lng?: number;
};

function isLatinText(value: string): boolean {
  return /^[\x20-\x7E]+$/.test(value.trim());
}

function uniqueParts(parts: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const part of parts) {
    const key = part.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(part);
    }
  }
  return result;
}

function parseUserCoordinates(user?: UserAddressFields): { lat: number; lng: number } | undefined {
  if (!user) return undefined;

  const location = user.location;
  if (location?.lat != null && location?.lng != null) {
    const lat = Number(location.lat);
    const lng = Number(location.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }
  }

  if (Array.isArray(location?.coordinates) && location.coordinates.length >= 2) {
    const lng = Number(location.coordinates[0]);
    const lat = Number(location.coordinates[1]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }
  }

  if (user.lat != null && user.lng != null) {
    const lat = Number(user.lat);
    const lng = Number(user.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }
  }

  return undefined;
}

function cityToEnglishAddress(city: { name: string; province: string }): string {
  return `${city.name}, ${city.province}, Pakistan`;
}

function matchCityFromStoredFields(user?: UserAddressFields) {
  const candidates = [user?.city, user?.area, user?.address?.city, user?.address?.state];
  for (const candidate of candidates) {
    const matched = matchPakistanCityByName(String(candidate || ''));
    if (matched) return matched;
  }
  return undefined;
}

/** English address for a user (buyer) on order screens. */
export function formatEnglishUserAddress(user?: UserAddressFields): string {
  if (!user) return '—';

  const latinParts = uniqueParts(
    [user.area, user.city, user.country, user.address?.city, user.address?.state, user.address?.country]
      .map((part) => String(part || '').trim())
      .filter((part) => part.length > 0 && isLatinText(part)),
  );

  if (latinParts.length > 0) {
    return latinParts.join(', ');
  }

  const matchedCity = matchCityFromStoredFields(user);
  if (matchedCity) {
    return cityToEnglishAddress(matchedCity);
  }

  const coords = parseUserCoordinates(user);
  if (coords) {
    const fromCoords = getEnglishAddressNearCoordinates(coords.lat, coords.lng);
    if (fromCoords) return fromCoords;

    const nearest = getNearestPakistanCity(coords.lat, coords.lng);
    if (nearest) return cityToEnglishAddress(nearest);
  }

  return '—';
}

/** Buyer city label for order cards and detail headers. */
export function getEnglishCityForUser(user?: UserAddressFields): string {
  const address = formatEnglishUserAddress(user);
  if (address !== '—') {
    return address.split(',')[0]?.trim() || address;
  }

  return '—';
}

export function getAllPakistanCityNames(): string[] {
  return PAKISTAN_CITY_DROPDOWN_OPTIONS.map((option) => option.label);
}
