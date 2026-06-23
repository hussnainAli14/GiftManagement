/** Default map center for Pakistan (Islamabad) — used when the emulator reports a non-PK GPS fix. */
export const PAKISTAN_DEFAULT_LOCATION = {
  lat: 33.6844,
  lng: 73.0479,
  city: 'Islamabad',
  area: 'Islamabad Capital Territory',
  country: 'Pakistan',
} as const;

/** Rough bounding box for Pakistan (mainland). */
export const PAKISTAN_BOUNDS = {
  minLat: 23.5,
  maxLat: 37.5,
  minLng: 60.5,
  maxLng: 77.5,
} as const;

export function isInPakistan(lat: number, lng: number): boolean {
  return (
    lat >= PAKISTAN_BOUNDS.minLat &&
    lat <= PAKISTAN_BOUNDS.maxLat &&
    lng >= PAKISTAN_BOUNDS.minLng &&
    lng <= PAKISTAN_BOUNDS.maxLng
  );
}

/** Common Pakistani cities (for reference / future pickers). */
export const PAKISTAN_CITIES = {
  islamabad: PAKISTAN_DEFAULT_LOCATION,
  karachi: { lat: 24.8607, lng: 67.0011, city: 'Karachi', area: 'Sindh', country: 'Pakistan' },
  lahore: { lat: 31.5204, lng: 74.3587, city: 'Lahore', area: 'Punjab', country: 'Pakistan' },
  rawalpindi: { lat: 33.5651, lng: 73.0169, city: 'Rawalpindi', area: 'Punjab', country: 'Pakistan' },
  faisalabad: { lat: 31.4504, lng: 73.135, city: 'Faisalabad', area: 'Punjab', country: 'Pakistan' },
} as const;
