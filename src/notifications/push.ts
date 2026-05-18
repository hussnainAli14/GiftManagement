import { Platform } from 'react-native';
import type { BackendNotification } from '../api/notificationApi';
import { navigateFromNotification } from '../navigation/notificationNavigation';

type RemoteMessage = any;

function getMessaging(): any | null {
  try {
    const m = require('@react-native-firebase/messaging').default;
    // Accessing messaging() throws if Firebase isn't configured natively.
    m();
    return m;
  } catch {
    return null;
  }
}

function getNotifee(): any | null {
  try {
    return require('@notifee/react-native').default;
  } catch {
    return null;
  }
}

export async function ensureDefaultChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  const notifee = getNotifee();
  if (!notifee) return;
  const { AndroidImportance } = require('@notifee/react-native');
  await notifee.createChannel({
    id: 'default',
    name: 'Default',
    importance: AndroidImportance.HIGH,
  });
}

export function buildLocalNotification(remoteMessage: RemoteMessage) {
  const title = remoteMessage.notification?.title || 'Notification';
  const body = remoteMessage.notification?.body || '';
  const data = remoteMessage.data || {};
  return { title, body, data };
}

export async function displayRemoteMessage(remoteMessage: RemoteMessage) {
  await ensureDefaultChannel();
  const notifee = getNotifee();
  if (!notifee) return;
  const { title, body, data } = buildLocalNotification(remoteMessage);
  await notifee.displayNotification({
    title,
    body,
    data,
    android: {
      channelId: 'default',
      smallIcon: 'ic_notification',
      pressAction: { id: 'default' },
    },
    ios: {
      foregroundPresentationOptions: { banner: true, sound: true, badge: true, list: true },
    },
  });
}

export async function requestUserPermission(): Promise<boolean> {
  const messaging = getMessaging();
  if (!messaging) return false;
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  return enabled;
}

export async function getFcmToken(): Promise<string> {
  const messaging = getMessaging();
  if (!messaging) return '';
  const token = await messaging().getToken();
  return token;
}

export async function handleNotificationOpen(data: Record<string, string | undefined>) {
  const notification: BackendNotification = {
    _id: '',
    title: data.title || '',
    message: data.message || data.body || '',
    read: true,
    createdAt: new Date().toISOString(),
    type: data.type,
    data,
  };
  navigateFromNotification(notification);
}

export function wireForegroundAndOpenedHandlers(opts?: { onForegroundMessage?: () => void }) {
  const messaging = getMessaging();
  if (!messaging) {
    return () => {};
  }

  const unsubOnMessage = messaging().onMessage(async (remoteMessage: RemoteMessage) => {
    await displayRemoteMessage(remoteMessage);
    opts?.onForegroundMessage?.();
  });

  const unsubOnOpen = messaging().onNotificationOpenedApp(async (remoteMessage: RemoteMessage) => {
    await handleNotificationOpen(remoteMessage.data || {});
  });

  // If app was opened from quit state
  messaging()
    .getInitialNotification()
    .then((rm) => {
      if (rm?.data) {
        handleNotificationOpen(rm.data);
      }
    })
    .catch(() => {});

  return () => {
    unsubOnMessage();
    unsubOnOpen();
  };
}

