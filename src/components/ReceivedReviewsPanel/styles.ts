import { StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';

export const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderGray,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  summaryTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.darkGray,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 32,
    color: colors.black,
  },
  summarySubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.darkGray,
    marginTop: 6,
  },
  errorText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.errorRed,
    marginTop: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderGray,
    padding: 14,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  reviewerName: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.base,
    color: colors.black,
  },
  contextLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.darkGray,
    marginTop: 2,
  },
  dateText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.darkGray,
    marginLeft: 8,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 8,
  },
  comment: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.black,
    lineHeight: 20,
  },
  commentMuted: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.darkGray,
    fontStyle: 'italic',
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.lg,
    color: colors.black,
    marginTop: 12,
  },
  emptyBody: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.darkGray,
    textAlign: 'center',
    marginTop: 8,
  },
});
