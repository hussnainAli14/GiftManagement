/**
 * Gift Management App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { MessageSocketProvider } from './src/context/MessageSocketContext';
import { NotificationBadgeProvider, useNotificationBadge } from './src/context/NotificationBadgeContext';
import { navigationRef } from './src/navigation/navigationRef';
import { RootNavigator } from './src/navigation';
import { getFcmToken, requestUserPermission, wireForegroundAndOpenedHandlers } from './src/notifications/push';
import { getMyProfileApi, registerDeviceTokenApi } from './src/api/userApi';
import { useAuth } from './src/context/AuthContext';

function PushWiring() {
  const { refresh } = useNotificationBadge();
  React.useEffect(() => wireForegroundAndOpenedHandlers({ onForegroundMessage: refresh }), [refresh]);
  return null;
}

function PushAutoRegister() {
  const { isAuthenticated, isHydrating } = useAuth();

  React.useEffect(() => {
    let cancelled = false;
    if (isHydrating || !isAuthenticated) return;

    (async () => {
      try {
        const me = await getMyProfileApi();
        if (cancelled) return;
        if (me.notificationsEnabled === false) return;

        // Register token even if notification permission is not granted yet.
        // Permission controls whether notifications can display; token controls whether we can send.
        const token = await getFcmToken();
        if (cancelled) return;
        if (!token) return;

        await registerDeviceTokenApi(token);

        // Best-effort: request permission after token registration.
        await requestUserPermission().catch(() => false);
      } catch {
        // best-effort only
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isHydrating]);

  return null;
}

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'dark-content'} />
      <NavigationContainer ref={navigationRef}>
        <AuthProvider>
          <MessageSocketProvider>
            <NotificationBadgeProvider>
              <PushAutoRegister />
              <PushWiring />
              <RootNavigator />
            </NotificationBadgeProvider>
          </MessageSocketProvider>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
