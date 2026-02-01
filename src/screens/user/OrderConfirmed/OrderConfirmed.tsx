import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../../components';
import { styles } from './styles';
import { colors } from '../../../theme';

type OrderConfirmedParamList = {
  OrderConfirmed: undefined;
  MyOrders: undefined;
};

const OrderConfirmed = () => {
  const navigation = useNavigation<NativeStackNavigationProp<OrderConfirmedParamList, 'OrderConfirmed'>>();

  const handleViewOrders = () => {
    navigation.navigate('MyOrders');
  };

  const handleContinueGifting = () => {
    // Go back to Home to continue gifting
    navigation.getParent()?.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Icon name="check" size={56} color={colors.black} />
        </View>
        <Text style={styles.title}>Gift Order Placed Successfully!</Text>
        <Text style={styles.message}>
          Thank you for sharing joy! Your gift has been ordered and will be delivered soon.
        </Text>
        <Button
          variant="primaryPurple"
          fullWidth
          onPress={handleViewOrders}
          style={styles.primaryButton}
        >
          View My Orders
        </Button>
        <Button
          variant="secondaryPurple"
          fullWidth
          onPress={handleContinueGifting}
          style={styles.secondaryButton}
        >
          Continue Gifting
        </Button>
      </View>
    </View>
  );
};

export default OrderConfirmed;
