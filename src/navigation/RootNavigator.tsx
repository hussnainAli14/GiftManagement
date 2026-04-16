import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import VendorNavigator from './VendorNavigator';

const RootNavigator = () => {
  const { isAuthenticated, userRole, isHydrating } = useAuth();

  if (isHydrating) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }
  if (userRole === 'vendor') {
    return <VendorNavigator />;
  }
  return <MainNavigator />;
};

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});

export default RootNavigator;
