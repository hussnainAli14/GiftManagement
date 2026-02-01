import { StyleSheet } from 'react-native';
import { colors, typography } from '../../../../theme';

const VENDOR_BLUE = '#2563EB';
const BADGE_PENDING = '#F87171';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.textStyles.h5,
    color: colors.black,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowLabel: {
    ...typography.textStyles.bodySmall,
    color: colors.textSecondary,
  },
  rowValue: {
    ...typography.textStyles.bodySmall,
    color: colors.black,
    flex: 1,
    marginLeft: 8,
    textAlign: 'right',
  },
  orderId: {
    ...typography.textStyles.bodySmall,
    color: colors.black,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: BADGE_PENDING,
  },
  statusBadgeText: {
    ...typography.textStyles.caption,
    color: colors.white,
    fontWeight: '600',
  },
  addressText: {
    ...typography.textStyles.bodySmall,
    color: colors.black,
    marginTop: 4,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  linkIcon: {
    marginRight: 8,
  },
  link: {
    ...typography.textStyles.bodySmall,
    color: VENDOR_BLUE,
    textDecorationLine: 'underline',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
  },
  itemRowLast: {
    borderBottomWidth: 0,
  },
  itemThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
    marginRight: 12,
    overflow: 'hidden',
  },
  itemThumbImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    ...typography.textStyles.bodySmall,
    color: colors.black,
    marginBottom: 2,
  },
  itemQty: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
  },
  itemPrice: {
    ...typography.textStyles.label,
    color: colors.black,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    ...typography.textStyles.h6,
    color: colors.black,
  },
  totalValue: {
    ...typography.textStyles.h6,
    color: colors.black,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
    gap: 10,
  },
  footerButtonColumn: {
    flex: 1,
    alignItems: 'center',
  },
  footerButtonAccept: {
    width: '100%',
    backgroundColor: VENDOR_BLUE,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  footerButtonProcess: {
    width: '100%',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: VENDOR_BLUE,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  footerButtonTextPrimary: {
    ...typography.textStyles.label,
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
  footerButtonTextOutline: {
    ...typography.textStyles.label,
    fontSize: 15,
    fontWeight: '600',
    color: VENDOR_BLUE,
  },
  footerButtonSubtext: {
    ...typography.textStyles.caption,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
});

export const VENDOR_BLUE_COLOR = VENDOR_BLUE;
