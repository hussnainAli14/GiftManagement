import { StyleSheet } from 'react-native';
import { colors, typography } from '../../../theme';

const VENDOR_BLUE = '#2563EB';
const DENY_RED = '#DC2626';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  vendorName: {
    ...typography.textStyles.h6,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 4,
  },
  companyName: {
    ...typography.textStyles.bodySmall,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  email: {
    ...typography.textStyles.bodySmall,
    color: colors.black,
    marginBottom: 4,
  },
  appliedDate: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  approveButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: VENDOR_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  denyButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: DENY_RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveButtonText: {
    ...typography.textStyles.label,
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  denyButtonText: {
    ...typography.textStyles.label,
    color: DENY_RED,
    fontSize: 14,
    fontWeight: '600',
  },
});

export const VENDOR_BLUE_COLOR = VENDOR_BLUE;
