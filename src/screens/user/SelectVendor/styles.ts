import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';
import { typography } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  vendorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGray,
    marginBottom: 12,
    gap: 12,
  },
  vendorImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
  },
  vendorContent: {
    flex: 1,
    minWidth: 0,
  },
  vendorName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold as '700',
    color: colors.black,
    marginBottom: 4,
  },
  vendorAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  vendorAddressText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.darkGray,
    flex: 1,
  },
  vendorDistance: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.darkGray,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.darkGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  loadingSpinner: {
    marginTop: 24,
  },
  emptyListText: {
    padding: 16,
    color: colors.darkGray,
    textAlign: 'center',
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
  },
  listContentWhenEmpty: {
    flexGrow: 1,
  },
  listEmptyWrap: {
    flexGrow: 1,
    minHeight: 220,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  missingParamsWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
