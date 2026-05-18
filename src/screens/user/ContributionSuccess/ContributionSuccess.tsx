import React, { useCallback, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../../components';
import { styles } from './styles';
import { colors } from '../../../theme';

export interface ContributionSuccessParams {
  eventTitle?: string;
}

type ContributionSuccessRouteProp = RouteProp<
  { params: ContributionSuccessParams },
  'params'
>;

type ContributionSuccessStackParamList = {
  ContributionSuccess: ContributionSuccessParams;
};

const ContributionSuccess = () => {
  const route = useRoute<ContributionSuccessRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<ContributionSuccessStackParamList, 'ContributionSuccess'>>();
  const { eventTitle } = route.params ?? {};

  const goToHome = useCallback(() => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('Home' as never, { screen: 'HomeMain' } as never);
      return;
    }
    navigation.navigate('HomeMain' as never);
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={goToHome}
          style={{ marginRight: 16 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-left" size={24} color="#000000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, goToHome]);

  const handleBackToWishlist = () => {
    navigation.navigate('PersonsWishlist', { eventTitle: eventTitle ?? "Person's wishlist" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Icon name="check" size={56} color={colors.successGreen} />
        </View>
        <Text style={styles.title}>Your Contribution is a Success!</Text>
        <Text style={styles.message}>
          Thank you for making a difference. Your generosity brings someone closer to their wishes.
        </Text>
        <Button
          variant="primaryPurple"
          fullWidth
          onPress={handleBackToWishlist}
          style={styles.backButton}
        >
          Back to Wishlist
        </Button>
      </View>
    </View>
  );
};

export default ContributionSuccess;
