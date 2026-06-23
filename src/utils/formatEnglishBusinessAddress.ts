import { getEnglishAddressNearCoordinates } from '../data/pakistanCities';
import { hasDisplayValue } from './hasDisplayValue';

type VendorAddressFields = {
  businessAddress?: string;
  city?: string;
  area?: string;
  country?: string;
  location?: { lat?: number; lng?: number };
};

function isLatinText(value: string): boolean {
  return /^[\x20-\x7E]+$/.test(value.trim());
}

function joinEnglishParts(parts: Array<string | undefined>): string | undefined {
  const filtered = parts
    .map((part) => part?.trim())
    .filter((part): part is string => hasDisplayValue(part) && isLatinText(part));
  return filtered.length > 0 ? filtered.join(', ') : undefined;
}

/** Prefer English address labels for vendor profile and cards. */
export function formatEnglishBusinessAddress(vendor: VendorAddressFields): string | undefined {
  const storedAddress = vendor.businessAddress?.trim();
  if (
    storedAddress &&
    storedAddress.toLowerCase() !== 'not provided' &&
    storedAddress.toLowerCase() !== 'address pending' &&
    isLatinText(storedAddress)
  ) {
    return storedAddress;
  }

  const fromFields = joinEnglishParts([vendor.area, vendor.city, vendor.country]);
  if (fromFields) return fromFields;

  const lat = vendor.location?.lat;
  const lng = vendor.location?.lng;
  if (lat != null && lng != null) {
    const fromCoords = getEnglishAddressNearCoordinates(lat, lng);
    if (fromCoords) return fromCoords;
  }

  if (storedAddress && storedAddress.toLowerCase() !== 'not provided') {
    const fromCoords =
      lat != null && lng != null ? getEnglishAddressNearCoordinates(lat, lng) : undefined;
    return fromCoords;
  }

  return undefined;
}
