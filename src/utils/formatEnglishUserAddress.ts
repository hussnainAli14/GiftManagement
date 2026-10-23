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

const PAKISTAN_PROVINCE_NAMES = new Set([
  'punjab',
  'sindh',
  'khyber pakhtunkhwa',
  'balochistan',
  'gilgit-baltistan',
  'azad kashmir',
  'islamabad capital territory',
]);

function isProvinceName(value: string): boolean {
  return PAKISTAN_PROVINCE_NAMES.has(value.trim().toLowerCase());
}

function resolveCityNameFromCandidates(candidates: Array<string | undefined>): string | undefined {
  for (const candidate of candidates) {
    const matched = matchPakistanCityByName(String(candidate || ''));
    if (matched) return matched.name;
  }
  return undefined;
}

/** City label for a user (e.g. "Bahawalpur"). */
export function getEnglishCityForUser(user?: UserAddressFields): string {
  const resolved = getEnglishCityLabelForUser(user);
  return resolved || '—';
}

/** City and country for display (e.g. "Bahawalpur, Pakistan"). */
export function getEnglishCityCountryForUser(user?: UserAddressFields): string {
  const city = getEnglishCityLabelForUser(user);
  if (!city) return '—';
  const country = String(user?.country || user?.address?.country || 'Pakistan').trim() || 'Pakistan';
  return `${city}, ${country}`;
}

function getEnglishCityLabelForUser(user?: UserAddressFields): string | undefined {
  if (!user) return undefined;

  const fromCityFields = resolveCityNameFromCandidates([user.city, user.address?.city]);
  if (fromCityFields) return fromCityFields;

  const coords = parseUserCoordinates(user);
  if (coords) {
    const nearest = getNearestPakistanCity(coords.lat, coords.lng);
    if (nearest) return nearest.name;
  }

  const fromOtherFields = resolveCityNameFromCandidates([user.area, user.address?.state]);
  if (fromOtherFields) return fromOtherFields;

  const address = formatEnglishUserAddress(user);
  if (address !== '—') {
    for (const part of address.split(',').map((p) => p.trim()).filter(Boolean)) {
      if (isProvinceName(part)) continue;
      const matched = matchPakistanCityByName(part);
      if (matched) return matched.name;
    }
  }

  return undefined;
}

export function getAllPakistanCityNames(): string[] {
  return PAKISTAN_CITY_DROPDOWN_OPTIONS.map((option) => option.label);
}
