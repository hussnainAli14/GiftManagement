import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../../components';
import { colors } from '../../../theme';
import { styles } from './styles';
import type { WelcomeScreenNavigationProp } from './types';

const Welcome = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const insets = useSafeAreaInsets();

  const handleLogin = () => {
    navigation.navigate('RoleSelection', { mode: 'login' });
  };

  const handleCreateAccount = () => {
    navigation.navigate('RoleSelection', { mode: 'signup' });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Section - Icon and Description */}
      <View style={styles.topSection}>
        <View style={styles.iconContainer}>
          <Icon name="card-giftcard" size={80} color={colors.white} />
        </View>

        <Text style={styles.description}>
          Your ultimate hub for events,{'\n'}wishlists, and seamless gifting.
        </Text>
      </View>

      {/* Buttons - Fixed at bottom */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 24 }]}>
        <Button
          variant="primary"
          fullWidth
          onPress={handleLogin}
          style={styles.loginButton}
        >
          Login
        </Button>
        
        <Button
          variant="secondary"
          fullWidth
          onPress={handleCreateAccount}
          style={styles.createAccountButton}
        >
          Create Account
        </Button>
      </View>
    </View>
  );
};

export default Welcome;
