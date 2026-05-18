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
import { createContributionPeerReviewApi } from '../../../api/reviewApi';
import { colors } from '../../../theme';
import { styles } from '../VendorReview/styles';

export type FriendContributionReviewParams = {
  campaignId: string;
  revieweeId: string;
  friendName?: string;
};

type StackParamList = {
  FriendContributionReview: FriendContributionReviewParams;
  ReviewSubmittedSuccess: { mode?: 'contribution_peer'; campaignId?: string };
};

const FriendContributionReview = () => {
  const route = useRoute<RouteProp<{ params: FriendContributionReviewParams }, 'params'>>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { campaignId, revieweeId, friendName } = route.params ?? {
    campaignId: '',
    revieweeId: '',
  };

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!campaignId || !revieweeId) {
      Alert.alert('Error', 'Contribution information is missing.');
      return;
    }
    if (rating < 1) {
      Alert.alert('Rating required', 'Please select a star rating from 1 to 5.');
      return;
    }
    setSubmitting(true);
    try {
      await createContributionPeerReviewApi({
        campaignId,
        revieweeId,
        rating,
        comment: review.trim() || undefined,
      });
      navigation.replace('ReviewSubmittedSuccess', {
        mode: 'contribution_peer',
        campaignId,
      });
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
        <Text style={styles.title}>Rate your contributor</Text>
        <Text style={styles.subtitle}>
          Share how reliable they were as a contributor for this request.
        </Text>

        <View style={styles.vendorCard}>
          <Text style={styles.vendorLabel}>Contributor</Text>
          <Text style={styles.vendorName}>{friendName?.trim() || 'Friend'}</Text>
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
          placeholder="Optional feedback about this contributor..."
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

export default FriendContributionReview;
