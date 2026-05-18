import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { getMyReceivedReviewsApi, type ReceivedReviewItem } from '../../api/reviewApi';
import { colors } from '../../theme';
import { styles } from './styles';

function formatDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' });
}

function StarRow({ rating }: { rating: number }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          name={star <= rating ? 'star' : 'star-border'}
          size={18}
          color={star <= rating ? colors.primary : colors.darkGray}
        />
      ))}
    </View>
  );
}

function ReviewCard({ item }: { item: ReceivedReviewItem }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Icon name="person" size={22} color={colors.darkGray} />
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.reviewerName}>{item.reviewerName}</Text>
          {item.contextLabel ? (
            <Text style={styles.contextLabel}>{item.contextLabel}</Text>
          ) : null}
        </View>
        <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
      </View>
      <StarRow rating={item.rating} />
      {item.comment?.trim() ? (
        <Text style={styles.comment}>{item.comment.trim()}</Text>
      ) : (
        <Text style={styles.commentMuted}>No written review</Text>
      )}
    </View>
  );
}

export const ReceivedReviewsPanel = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviews, setReviews] = useState<ReceivedReviewItem[]>([]);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const data = await getMyReceivedReviewsApi();
      setAverageRating(data.averageRating);
      setReviewCount(data.reviewCount);
      setReviews(data.reviews ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load reviews.');
      setReviews([]);
      setReviewCount(0);
      setAverageRating(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={reviews}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ReviewCard item={item} />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />
      }
      ListHeaderComponent={
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Your rating</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryValue}>
              {averageRating != null ? averageRating.toFixed(1) : '—'}
            </Text>
            <Icon name="star" size={28} color={colors.primary} />
          </View>
          <Text style={styles.summarySubtitle}>
            {reviewCount === 0
              ? 'No reviews yet'
              : `${reviewCount} review${reviewCount === 1 ? '' : 's'} from others`}
          </Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      }
      ListEmptyComponent={
        !error ? (
          <View style={styles.emptyWrap}>
            <Icon name="rate-review" size={48} color={colors.darkGray} />
            <Text style={styles.emptyTitle}>No reviews yet</Text>
            <Text style={styles.emptyBody}>
              When others rate you, their reviews will appear here.
            </Text>
          </View>
        ) : null
      }
    />
  );
};

export default ReceivedReviewsPanel;
