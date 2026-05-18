import React, { useCallback, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import { colors } from '../../../theme';

type Params = {
  mode?: 'topup' | 'pay_to_wallet';
  amount?: number;
};

const formatPkr = (n: number) =>
  `PKR ${n.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const WalletPaymentSuccess = () => {
  const route = useRoute<RouteProp<{ params: Params }, 'params'>>();
  const navigation = useNavigation<NativeStackNavigationProp<Record<string, object>>>();
  const { mode = 'topup', amount = 0 } = route.params ?? {};

  const goBack = useCallback(() => {
    if (mode === 'topup') {
      navigation.navigate('WalletMain' as never);
      return;
    }
    navigation.getParent()?.goBack();
  }, [navigation, mode]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={goBack} style={{ marginRight: 16 }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon name="chevron-left" size={24} color="#000000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, goBack]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Icon name="check" size={56} color={colors.successGreen} />
        </View>
        <Text style={styles.title}>
          {mode === 'pay_to_wallet' ? 'Payment sent!' : 'Top-up successful!'}
        </Text>
        <Text style={styles.message}>
          {mode === 'pay_to_wallet'
            ? `${formatPkr(amount)} was added to the recipient's wallet. They have been notified.`
            : `${formatPkr(amount)} was added to your wallet.`}
        </Text>
      </View>
    </View>
  );
};

export default WalletPaymentSuccess;
