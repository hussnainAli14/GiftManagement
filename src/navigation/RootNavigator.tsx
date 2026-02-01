import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import VendorNavigator from './VendorNavigator';

const RootNavigator = () => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }
  if (userRole === 'vendor') {
    return <VendorNavigator />;
  }
  return <MainNavigator />;
};

export default RootNavigator;
