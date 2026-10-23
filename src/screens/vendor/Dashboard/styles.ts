import { StyleSheet } from 'react-native';
import { colors, typography } from '../../../theme';

const VENDOR_BLUE = '#2563EB';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  welcomeTitle: {
    ...typography.textStyles.h2,
    color: colors.black,
    marginTop: 8,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    ...typography.textStyles.bodySmall,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  cardValue: {
    ...typography.textStyles.h4,
    color: colors.black,
    marginBottom: 4,
  },
  trendUp: {
    ...typography.textStyles.caption,
    color: colors.successGreen,
  },
  trendDown: {
    ...typography.textStyles.caption,
    color: colors.errorRed,
  },
  trendNeutral: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
  },
  loadingWrap: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorCard: {
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderGray,
  },
  errorTitle: {
    ...typography.textStyles.h4,
    color: colors.black,
    marginBottom: 6,
  },
  errorBody: {
    ...typography.textStyles.bodySmall,
    color: colors.textSecondary,
  },
  errorHint: {
    ...typography.textStyles.caption,
    color: colors.primary,
    marginTop: 10,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 10,
  },
  actionButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: VENDOR_BLUE,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  actionButtonText: {
    ...typography.textStyles.button,
    color: colors.white,
  },
  buttonIcon: {
    marginRight: 8,
  },
  lowStockSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  lowStockHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  lowStockTitle: {
    ...typography.textStyles.h4,
    color: '#B45309',
    fontWeight: '700',
  },
  lowStockHint: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
  },
  lowStockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    gap: 10,
  },
  lowStockIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lowStockBody: {
    flex: 1,
    minWidth: 0,
  },
  lowStockName: {
    ...typography.textStyles.body,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 2,
  },
  lowStockRemaining: {
    ...typography.textStyles.caption,
    color: '#B45309',
    fontWeight: '600',
  },
});

export const VENDOR_BLUE_COLOR = VENDOR_BLUE;
