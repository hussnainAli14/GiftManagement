import { StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { typography } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.lightGray,
    gap: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.gray,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 4,
  },
  actionsInline: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderGray,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold as '700',
    color: colors.black,
    flex: 1,
  },
  description: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.darkGray,
    marginBottom: 4,
  },
  price: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold as '600',
    color: colors.primary,
    marginBottom: 6,
  },
  progressWrapper: {
    marginTop: 0,
  },
});
