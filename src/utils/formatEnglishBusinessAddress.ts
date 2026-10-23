import { getEnglishAddressNearCoordinates, getNearestPakistanCity, matchPakistanCityByName } from '../data/pakistanCities';
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

function cityCountryFromAddress(address: string): string | undefined {
  const parts = address.split(',').map((part) => part.trim()).filter(Boolean);
  if (parts.length === 0) return undefined;
  if (parts.length === 1) {
    const matched = matchPakistanCityByName(parts[0]);
    return matched ? `${matched.name}, Pakistan` : parts[0];
  }
  return `${parts[0]}, ${parts[parts.length - 1]}`;
}

/** City and country only (e.g. "Bahawalpur, Pakistan") for vendor profile display. */
export function formatBusinessCityCountry(vendor: VendorAddressFields): string | undefined {
  const fromFields = joinEnglishParts([vendor.city, vendor.country || 'Pakistan']);
  if (fromFields) return fromFields;

  const lat = vendor.location?.lat;
  const lng = vendor.location?.lng;
  if (lat != null && lng != null) {
    const nearest = getNearestPakistanCity(lat, lng);
    if (nearest) return `${nearest.name}, Pakistan`;
  }

  const storedAddress = vendor.businessAddress?.trim();
  if (
    storedAddress &&
    storedAddress.toLowerCase() !== 'not provided' &&
    storedAddress.toLowerCase() !== 'address pending' &&
    isLatinText(storedAddress)
  ) {
    return cityCountryFromAddress(storedAddress);
  }

  const fullAddress = formatEnglishBusinessAddress(vendor);
  if (fullAddress) return cityCountryFromAddress(fullAddress);

  return undefined;
}
