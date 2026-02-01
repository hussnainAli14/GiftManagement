import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../theme';
import { styles } from './styles';

export type RoleSelectionParams = {
  mode: 'login' | 'signup';
};

type RoleSelectionRouteProp = RouteProp<
  { params: RoleSelectionParams },
  'params'
>;

type AuthStackParamList = {
  RoleSelection: RoleSelectionParams;
  Login: { role?: 'user' | 'vendor' };
  SignUp: { role?: 'user' | 'vendor' };
};

type Role = 'user' | 'vendor';

const RoleSelection = () => {
  const route = useRoute<RoleSelectionRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'RoleSelection'>>();
  const { mode } = route.params ?? { mode: 'login' };

  const handleSelectRole = (role: Role) => {
    if (mode === 'login') {
      navigation.navigate('Login', { role });
    } else {
      navigation.navigate('SignUp', { role });
    }
  };

  const title = mode === 'login' ? 'Select role to continue' : 'Create account as';
  const subtitle =
    mode === 'login'
      ? 'Choose how you want to sign in.'
      : 'Choose whether you are a user or a vendor.';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <TouchableOpacity
        style={styles.optionCard}
        onPress={() => handleSelectRole('user')}
        activeOpacity={0.7}
      >
        <View style={styles.optionIcon}>
          <Icon name="person" size={32} color={colors.primary} />
        </View>
        <Text style={styles.optionLabel}>User</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionCard}
        onPress={() => handleSelectRole('vendor')}
        activeOpacity={0.7}
      >
        <View style={[styles.optionIcon]}>
          <Icon name="store" size={32} color={colors.primary} />
        </View>
        <Text style={styles.optionLabel}>Vendor</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RoleSelection;
