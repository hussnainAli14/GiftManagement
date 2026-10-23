import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  heroImage: {
    width: '100%',
    height: 240,
    backgroundColor: colors.lightGray,
  },
  heroPlaceholder: {
    width: '100%',
    height: 240,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
  },
  hotBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#EA580C',
  },
  hotBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  ratingLoader: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
  },
  noReviews: {
    fontSize: 13,
    color: colors.darkGray,
    marginBottom: 10,
  },
  reviewsSection: {
    marginBottom: 20,
  },
  reviewCard: {
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    backgroundColor: colors.white,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.black,
    flex: 1,
    marginRight: 8,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 13,
    color: colors.darkGray,
    lineHeight: 18,
  },
  outOfStockBadge: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
  },
  outOfStockText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B91C1C',
  },
  vendor: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: colors.notificationGray,
    lineHeight: 22,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 12,
  },
  actions: {
    gap: 12,
  },
});
