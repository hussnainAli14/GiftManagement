/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Background handler (app in background / killed)
// Guarded so the app still runs when Firebase isn't configured yet.
try {
  const messaging = require('@react-native-firebase/messaging').default;
  const { displayRemoteMessage } = require('./src/notifications/push');
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    await displayRemoteMessage(remoteMessage);
  });
} catch (e) {
  // Firebase not configured (no google-services / plist) — skip background push wiring.
}

AppRegistry.registerComponent(appName, () => App);
