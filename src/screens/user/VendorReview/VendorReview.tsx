import React, { useEffect, useState } from 'react';
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
import { createVendorReviewApi } from '../../../api/reviewApi';
import { getVendorsApi } from '../../../api/vendorApi';
import { colors } from '../../../theme';
import { styles } from './styles';

export type VendorReviewParams = {
  vendorId: string;
  vendorName?: string;
};

type StackParamList = {
  VendorReview: VendorReviewParams;
  ReviewSubmittedSuccess: undefined;
};

function resolveVendorLabel(vendor: { businessName?: string; name?: string }) {
  return vendor.businessName?.trim() || vendor.name?.trim() || '';
}

const VendorReview = () => {
  const route = useRoute<RouteProp<{ params: VendorReviewParams }, 'params'>>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { vendorId, vendorName: routeVendorName } = route.params ?? { vendorId: '' };

  const [displayName, setDisplayName] = useState(routeVendorName?.trim() ?? '');
  const [resolvingName, setResolvingName] = useState(!routeVendorName?.trim());
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (routeVendorName?.trim()) {
      setDisplayName(routeVendorName.trim());
      setResolvingName(false);
      return;
    }
    if (!vendorId) {
      setResolvingName(false);
      return;
    }

    let cancelled = false;
    const load = async () => {
      try {
        const vendors = await getVendorsApi();
        const match = vendors.find((v) => v._id === vendorId);
        if (!cancelled && match) {
          const label = resolveVendorLabel(match);
          if (label) setDisplayName(label);
        }
      } catch {
        // Keep empty; user still sees vendor id context in title area
      } finally {
        if (!cancelled) setResolvingName(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [vendorId, routeVendorName]);

  const handleSubmit = async () => {
    if (!vendorId) {
      Alert.alert('Error', 'Vendor information is missing.');
      return;
    }
    if (rating < 1) {
      Alert.alert('Rating required', 'Please select a star rating from 1 to 5.');
      return;
    }
    setSubmitting(true);
    try {
      await createVendorReviewApi({
        vendorId,
        rating,
        comment: review.trim() || undefined,
      });
      navigation.replace('ReviewSubmittedSuccess');
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
        <Text style={styles.title}>Rate your experience</Text>
        <Text style={styles.subtitle}>
          Share how your order or contribution went with this vendor.
        </Text>

        <View style={styles.vendorCard}>
          <Text style={styles.vendorLabel}>Vendor</Text>
          {resolvingName ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 4 }} />
          ) : (
            <Text style={styles.vendorName}>{displayName || 'Selected vendor'}</Text>
          )}
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
          placeholder="Tell others about your experience..."
          placeholderTextColor={colors.darkGray}
          multiline
        />

        <Button
          variant="primary"
          fullWidth
          onPress={handleSubmit}
          disabled={submitting || rating < 1 || resolvingName}
          style={styles.submitBtn}
        >
          {submitting ? <ActivityIndicator color={colors.white} /> : 'Submit review'}
        </Button>
      </ScrollView>
    </View>
  );
};

export default VendorReview;
