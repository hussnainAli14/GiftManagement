import { StyleSheet } from 'react-native';
import { colors, typography } from '../../../theme';

const VENDOR_BLUE = '#2563EB';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: colors.lightGray,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    ...typography.textStyles.h4,
    color: colors.black,
  },
  email: {
    ...typography.textStyles.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeApproved: {
    backgroundColor: 'rgba(22,163,74,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(22,163,74,0.35)',
  },
  badgePending: {
    backgroundColor: 'rgba(234,88,12,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(234,88,12,0.35)',
  },
  badgeText: {
    ...typography.textStyles.caption,
    color: colors.black,
    fontWeight: '600',
  },
  badgeGhost: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGray,
  },
  badgeGhostText: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    fontWeight: '600',
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
    borderWidth: 1,
    borderColor: colors.borderGray,
  },
  errorTitle: {
    ...typography.textStyles.h5,
    color: colors.black,
    marginBottom: 6,
  },
  errorBody: {
    ...typography.textStyles.bodySmall,
    color: colors.textSecondary,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderGray,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.textStyles.h5,
    color: colors.black,
    marginBottom: 12,
  },
  row: {
    marginBottom: 12,
  },
  label: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    ...typography.textStyles.bodySmall,
    color: colors.black,
  },
  tipCard: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(37,99,235,0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.20)',
    padding: 14,
    marginTop: 6,
  },
  tipText: {
    flex: 1,
    ...typography.textStyles.bodySmall,
    color: colors.textSecondary,
  },
  logoutButton: {
    marginTop: 14,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoutButtonDisabled: {
    opacity: 0.75,
  },
  logoutButtonText: {
    ...typography.textStyles.button,
    color: colors.white,
  },
});

export const VENDOR_BLUE_COLOR = VENDOR_BLUE;

