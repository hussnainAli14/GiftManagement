export type PakistanCity = {
  id: string;
  name: string;
  province: string;
  lat: number;
  lng: number;
};

export type CityDropdownOption = { label: string; value: string };

/** Pre-sorted dropdown list for signup city picker. */
export const PAKISTAN_CITY_DROPDOWN_OPTIONS: CityDropdownOption[] = [
  { label: 'Abbottabad', value: 'abbottabad' },
  { label: 'Bahawalpur', value: 'bahawalpur' },
  { label: 'Chiniot', value: 'chiniot' },
  { label: 'Dera Ghazi Khan', value: 'dera-ghazi-khan' },
  { label: 'Faisalabad', value: 'faisalabad' },
  { label: 'Gujranwala', value: 'gujranwala' },
  { label: 'Gujrat', value: 'gujrat' },
  { label: 'Gwadar', value: 'gwadar' },
  { label: 'Hyderabad', value: 'hyderabad' },
  { label: 'Islamabad', value: 'islamabad' },
  { label: 'Karachi', value: 'karachi' },
  { label: 'Kasur', value: 'kasur' },
  { label: 'Lahore', value: 'lahore' },
  { label: 'Larkana', value: 'larkana' },
  { label: 'Mardan', value: 'mardan' },
  { label: 'Mingora', value: 'mingora' },
  { label: 'Mirpur', value: 'mirpur' },
  { label: 'Multan', value: 'multan' },
  { label: 'Muzaffarabad', value: 'muzaffarabad' },
  { label: 'Nawabshah', value: 'nawabshah' },
  { label: 'Okara', value: 'okara' },
  { label: 'Peshawar', value: 'peshawar' },
  { label: 'Quetta', value: 'quetta' },
  { label: 'Rahim Yar Khan', value: 'rahim-yar-khan' },
  { label: 'Rawalpindi', value: 'rawalpindi' },
  { label: 'Sahiwal', value: 'sahiwal' },
  { label: 'Sargodha', value: 'sargodha' },
  { label: 'Sheikhupura', value: 'sheikhupura' },
  { label: 'Sialkot', value: 'sialkot' },
  { label: 'Sukkur', value: 'sukkur' },
];

const PAKISTAN_CITIES: PakistanCity[] = [
  { id: 'abbottabad', name: 'Abbottabad', province: 'Khyber Pakhtunkhwa', lat: 34.1688, lng: 73.2215 },
  { id: 'bahawalpur', name: 'Bahawalpur', province: 'Punjab', lat: 29.3956, lng: 71.6722 },
  { id: 'chiniot', name: 'Chiniot', province: 'Punjab', lat: 31.7204, lng: 72.9789 },
  { id: 'dera-ghazi-khan', name: 'Dera Ghazi Khan', province: 'Punjab', lat: 30.0561, lng: 70.6348 },
  { id: 'faisalabad', name: 'Faisalabad', province: 'Punjab', lat: 31.4504, lng: 73.135 },
  { id: 'gujranwala', name: 'Gujranwala', province: 'Punjab', lat: 32.1877, lng: 74.1945 },
  { id: 'gujrat', name: 'Gujrat', province: 'Punjab', lat: 32.5742, lng: 74.0754 },
  { id: 'gwadar', name: 'Gwadar', province: 'Balochistan', lat: 25.1264, lng: 62.3225 },
  { id: 'hyderabad', name: 'Hyderabad', province: 'Sindh', lat: 25.396, lng: 68.3578 },
  { id: 'islamabad', name: 'Islamabad', province: 'Islamabad Capital Territory', lat: 33.6844, lng: 73.0479 },
  { id: 'karachi', name: 'Karachi', province: 'Sindh', lat: 24.8607, lng: 67.0011 },
  { id: 'kasur', name: 'Kasur', province: 'Punjab', lat: 31.1156, lng: 74.4466 },
  { id: 'lahore', name: 'Lahore', province: 'Punjab', lat: 31.5204, lng: 74.3587 },
  { id: 'larkana', name: 'Larkana', province: 'Sindh', lat: 27.5609, lng: 68.212 },
  { id: 'mardan', name: 'Mardan', province: 'Khyber Pakhtunkhwa', lat: 34.1989, lng: 72.0447 },
  { id: 'mingora', name: 'Mingora', province: 'Khyber Pakhtunkhwa', lat: 34.771, lng: 72.3601 },
  { id: 'mirpur', name: 'Mirpur', province: 'Azad Kashmir', lat: 33.1484, lng: 73.7519 },
  { id: 'multan', name: 'Multan', province: 'Punjab', lat: 30.1575, lng: 71.5249 },
  { id: 'muzaffarabad', name: 'Muzaffarabad', province: 'Azad Kashmir', lat: 34.3705, lng: 73.4705 },
  { id: 'nawabshah', name: 'Nawabshah', province: 'Sindh', lat: 26.2442, lng: 68.41 },
  { id: 'okara', name: 'Okara', province: 'Punjab', lat: 30.8081, lng: 73.4458 },
  { id: 'peshawar', name: 'Peshawar', province: 'Khyber Pakhtunkhwa', lat: 34.0151, lng: 71.5249 },
  { id: 'quetta', name: 'Quetta', province: 'Balochistan', lat: 30.1798, lng: 66.975 },
  { id: 'rahim-yar-khan', name: 'Rahim Yar Khan', province: 'Punjab', lat: 28.4202, lng: 70.2952 },
  { id: 'rawalpindi', name: 'Rawalpindi', province: 'Punjab', lat: 33.5651, lng: 73.0169 },
  { id: 'sahiwal', name: 'Sahiwal', province: 'Punjab', lat: 30.6705, lng: 73.1063 },
  { id: 'sargodha', name: 'Sargodha', province: 'Punjab', lat: 32.0836, lng: 72.6711 },
  { id: 'sheikhupura', name: 'Sheikhupura', province: 'Punjab', lat: 31.7167, lng: 73.985 },
  { id: 'sialkot', name: 'Sialkot', province: 'Punjab', lat: 32.4945, lng: 74.5229 },
  { id: 'sukkur', name: 'Sukkur', province: 'Sindh', lat: 27.7052, lng: 68.8574 },
];

const citiesById = new Map(PAKISTAN_CITIES.map((city) => [city.id, city]));

export function getPakistanCityDropdownOptions(): CityDropdownOption[] {
  return PAKISTAN_CITY_DROPDOWN_OPTIONS;
}

export function getPakistanCityById(cityId: string): PakistanCity | undefined {
  return citiesById.get(cityId);
}

export function getCoordinatesForCityId(cityId: string): { lat: number; lng: number } | undefined {
  const city = getPakistanCityById(cityId);
  if (!city) return undefined;
  return { lat: city.lat, lng: city.lng };
}

/** English business address for signup and profile display. */
export function getEnglishAddressForCityId(cityId: string): string | undefined {
  const city = getPakistanCityById(cityId);
  if (!city) return undefined;
  return `${city.name}, ${city.province}, Pakistan`;
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Resolve English address from coordinates (for legacy Urdu geocoded profiles). */
export function getNearestPakistanCity(lat: number, lng: number): PakistanCity | undefined {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return undefined;

  let nearest: PakistanCity | undefined;
  let nearestDistance = Infinity;

  for (const city of PAKISTAN_CITIES) {
    const distance = distanceKm(lat, lng, city.lat, city.lng);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = city;
    }
  }

  return nearest;
}

export function getEnglishAddressNearCoordinates(lat: number, lng: number): string | undefined {
  const nearest = getNearestPakistanCity(lat, lng);
  if (!nearest) return undefined;

  const nearestDistance = distanceKm(lat, lng, nearest.lat, nearest.lng);
  if (nearestDistance > 120) return undefined;

  return `${nearest.name}, ${nearest.province}, Pakistan`;
}

export function matchPakistanCityByName(cityName: string | undefined): PakistanCity | undefined {
  const normalized = String(cityName || '').trim().toLowerCase();
  if (!normalized) return undefined;

  return PAKISTAN_CITIES.find(
    (city) =>
      city.name.toLowerCase() === normalized ||
      city.id === normalized ||
      city.id.replace(/-/g, ' ') === normalized ||
      normalized.includes(city.name.toLowerCase()),
  );
}

export function getPakistanCountryName(): string {
  return 'Pakistan';
}

export function getAllPakistanCities(): PakistanCity[] {
  return [...PAKISTAN_CITIES];
}
