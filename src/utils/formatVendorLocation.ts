import { formatEnglishBusinessAddress } from './formatEnglishBusinessAddress';
import { hasDisplayValue } from './hasDisplayValue';

type VendorLocationFields = {
  area?: string;
  city?: string;
  country?: string;
  businessAddress?: string;
  location?: { lat?: number; lng?: number };
};

/** Human-readable location label for vendor cards (area, city, country). */
export function formatVendorLocation(vendor: VendorLocationFields): string | undefined {
  const englishAddress = formatEnglishBusinessAddress(vendor);
  if (englishAddress) {
    return englishAddress;
  }

  const parts = [vendor.area, vendor.city, vendor.country].filter(
    (part): part is string => hasDisplayValue(part),
  );
  if (parts.length > 0) {
    return parts.join(', ');
  }
  if (
    hasDisplayValue(vendor.businessAddress) &&
    vendor.businessAddress!.trim().toLowerCase() !== 'not provided'
  ) {
    return vendor.businessAddress!.trim();
  }
  return undefined;
}
