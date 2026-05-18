import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export type DeviceCoordinates = { lat: number; lng: number };

export async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Your location',
        message: 'We need your location to connect you with nearby vendors and gift options.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

export function getCurrentCoordinates(): Promise<DeviceCoordinates> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 },
    );
  });
}

export async function getDeviceLocationForSignup(): Promise<DeviceCoordinates> {
  const permitted = await requestLocationPermission();
  if (!permitted) {
    throw new Error('Location permission is required to create an account.');
  }
  return getCurrentCoordinates();
}

export async function getDeviceLocationForProfile(): Promise<DeviceCoordinates> {
  const permitted = await requestLocationPermission();
  if (!permitted) {
    throw new Error('Location permission is required to save your location.');
  }
  return getCurrentCoordinates();
}

/** @deprecated Use getDeviceLocationForSignup */
export const getDeviceLocationForVendor = getDeviceLocationForSignup;
