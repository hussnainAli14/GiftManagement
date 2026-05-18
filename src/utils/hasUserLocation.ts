import type { DeviceCoordinates } from './getDeviceLocation';

export type UserLocationFields = {
  lat?: number | null;
  lng?: number | null;
  location?: { lat?: number | null; lng?: number | null } | null;
};

function toCoordinate(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

export function getUserProfileCoordinates(fields: UserLocationFields): DeviceCoordinates | null {
  const lat = toCoordinate(fields.location?.lat);
  const lng = toCoordinate(fields.location?.lng);
  if (lat == null || lng == null) return null;
  return { lat, lng };
}

export function hasUserLocation(fields: UserLocationFields): boolean {
  return getUserProfileCoordinates(fields) != null;
}
