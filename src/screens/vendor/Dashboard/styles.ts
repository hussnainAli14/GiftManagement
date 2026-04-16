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
});

export const VENDOR_BLUE_COLOR = VENDOR_BLUE;
