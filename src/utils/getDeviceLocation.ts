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

/** Used only from profile edit — not login or signup. */
export async function getDeviceLocationForProfile(): Promise<DeviceCoordinates> {
  const permitted = await requestLocationPermission();
  if (!permitted) {
    throw new Error('Location permission is required to save your location.');
  }
  return getCurrentCoordinates();
}

/** @deprecated Signup uses the city dropdown — not device GPS. */
export async function getDeviceLocationForSignup(): Promise<DeviceCoordinates> {
  throw new Error('Please reload the app and select your city from the dropdown on signup.');
}

/** @deprecated Login does not use device location. */
export async function getDeviceLocationForLogin(): Promise<DeviceCoordinates | undefined> {
  return undefined;
}
