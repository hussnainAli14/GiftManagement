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
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold as '700',
    color: colors.black,
    marginBottom: 4,
  },
  description: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.darkGray,
    marginBottom: 6,
  },
  price: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold as '600',
    color: colors.primary,
    marginBottom: 8,
  },
  progressWrapper: {
    marginTop: 0,
  },
});
