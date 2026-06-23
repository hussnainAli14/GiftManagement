import { StyleSheet } from 'react-native';
import { colors, typography } from '../../../theme';

const ORDER_TOTAL_BLUE = '#2563EB';
const BADGE_OUT_FOR_DELIVERY = '#93C5FD';
const BADGE_PENDING = '#F87171';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  citySortHint: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 8,
    backgroundColor: colors.white,
    gap: 8,
  },
  searchWrapper: {
    flex: 1,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
    marginRight: 12,
    overflow: 'hidden',
  },
  productImageFill: {
    width: '100%',
    height: '100%',
  },
  orderDetails: {
    flex: 1,
    minWidth: 0,
  },
  orderId: {
    ...typography.textStyles.h6,
    color: colors.black,
    marginBottom: 2,
  },
  customerName: {
    ...typography.textStyles.bodySmall,
    color: colors.black,
    marginBottom: 2,
  },
  orderCity: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  orderTotal: {
    ...typography.textStyles.label,
    color: ORDER_TOTAL_BLUE,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    gap: 4,
  },
  statusPlain: {
    ...typography.textStyles.caption,
    color: colors.black,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    ...typography.textStyles.caption,
    color: colors.white,
    fontWeight: '600',
  },
  chevron: {
    marginLeft: 4,
  },
  customerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.lightGray,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerCountBadge: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ORDER_TOTAL_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  customerCountBadgeText: {
    ...typography.textStyles.label,
    color: colors.white,
    fontWeight: '700',
  },
});

export const ORDER_TOTAL_COLOR = ORDER_TOTAL_BLUE;
export const BADGE_COLORS = {
  outForDelivery: BADGE_OUT_FOR_DELIVERY,
  pending: BADGE_PENDING,
  completed: '#22C55E',
};
