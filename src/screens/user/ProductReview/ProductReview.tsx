import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../../components';
import { createProductReviewApi } from '../../../api/reviewApi';
import { colors } from '../../../theme';
import { styles } from '../VendorReview/styles';

export type ProductReviewParams = {
  orderId: string;
  productId?: string;
  productName?: string;
};

type StackParamList = {
  ProductReview: ProductReviewParams;
  ReviewSubmittedSuccess: { mode?: 'product' };
};

const ProductReview = () => {
  const route = useRoute<RouteProp<{ params: ProductReviewParams }, 'params'>>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { orderId, productId, productName } = route.params ?? { orderId: '' };

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!orderId) {
      Alert.alert('Error', 'Order information is missing.');
      return;
    }
    if (rating < 1) {
      Alert.alert('Rating required', 'Please select a star rating from 1 to 5.');
      return;
    }
    setSubmitting(true);
    try {
      await createProductReviewApi({
        orderId,
        productId: productId || undefined,
        rating,
        comment: review.trim() || undefined,
      });
      navigation.replace('ReviewSubmittedSuccess', { mode: 'product' });
    } catch (e) {
      Alert.alert('Failed', e instanceof Error ? e.message : 'Could not submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Rate this gift</Text>
        <Text style={styles.subtitle}>
          Share your rating for a gift you purchased. Your feedback helps other shoppers.
        </Text>

        <View style={styles.vendorCard}>
          <Text style={styles.vendorLabel}>Gift</Text>
          <Text style={styles.vendorName}>{productName?.trim() || 'Purchased gift'}</Text>
        </View>

        <Text style={styles.ratingLabel}>Your rating</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              style={styles.starButton}
              onPress={() => setRating(star)}
              accessibilityLabel={`${star} star${star === 1 ? '' : 's'}`}
            >
              <Icon
                name={star <= rating ? 'star' : 'star-border'}
                size={40}
                color={star <= rating ? colors.primary : colors.darkGray}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingValue}>
          {rating > 0 ? `${rating} out of 5 stars` : 'Tap a star to rate'}
        </Text>

        <Text style={styles.reviewLabel}>Your review (optional)</Text>
        <TextInput
          style={styles.reviewInput}
          value={review}
          onChangeText={setReview}
          placeholder="What did you think of this gift?"
          placeholderTextColor={colors.darkGray}
          multiline
        />

        <Button
          variant="primary"
          fullWidth
          onPress={handleSubmit}
          disabled={submitting || rating < 1}
          style={styles.submitBtn}
        >
          {submitting ? <ActivityIndicator color={colors.white} /> : 'Submit review'}
        </Button>
      </ScrollView>
    </View>
  );
};

export default ProductReview;
