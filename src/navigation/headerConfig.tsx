import React from 'react';
import { TouchableOpacity } from 'react-native';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { typography } from '../theme';

export const getDefaultHeaderOptions = (): Partial<NativeStackNavigationOptions> => ({
  headerStyle: {
    backgroundColor: '#FFFFFF',
  },
  headerTitleStyle: {
    ...typography.textStyles.h4,
    color: '#000000',
  },
  headerTintColor: '#000000', // This affects the back button color on iOS
});

export const getHeaderBackButton = (navigation: any) => () => (
  <TouchableOpacity
    onPress={() => navigation.goBack()}
    style={{ marginRight: 16 }}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <Icon name="chevron-left" size={24} color="#000000" />
  </TouchableOpacity>
);
