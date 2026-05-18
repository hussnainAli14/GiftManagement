import React, { useCallback, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import { colors } from '../../../theme';

type ReviewSubmittedSuccessParams = {
  mode?: 'contribution_peer';
  campaignId?: string;
};

const ReviewSubmittedSuccess = () => {
  const route = useRoute<RouteProp<{ params: ReviewSubmittedSuccessParams }, 'params'>>();
  const navigation = useNavigation<NativeStackNavigationProp<Record<string, object>>>();
  const { mode, campaignId } = route.params ?? {};
  const isPeerReview = mode === 'contribution_peer';

  const goBack = useCallback(() => {
    if (isPeerReview && campaignId) {
      navigation.navigate('ContributionProgress' as never, { campaignId } as never);
      return;
    }
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('Home' as never, { screen: 'HomeMain' } as never);
      return;
    }
    navigation.navigate('HomeMain' as never);
  }, [navigation, isPeerReview, campaignId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={goBack}
          style={{ marginRight: 16 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
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
        <Text style={styles.title}>Thank you for your review!</Text>
        <Text style={styles.message}>
          {isPeerReview
            ? 'Your rating helps others decide who to invite for group contributions.'
            : 'Your rating and feedback have been submitted for this vendor.'}
        </Text>
      </View>
    </View>
  );
};

export default ReviewSubmittedSuccess;
