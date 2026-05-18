import React from 'react';
import { View } from 'react-native';
import { ReceivedReviewsPanel } from '../../../components';
import { styles } from './styles';

const MyReviews = () => (
  <View style={styles.container}>
    <ReceivedReviewsPanel />
  </View>
);

export default MyReviews;
