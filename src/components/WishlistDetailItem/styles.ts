import { StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { typography } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: colors.lightGray,
  },
  content: {
    padding: 16,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold as '700',
    color: colors.black,
    marginBottom: 6,
  },
  price: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold as '600',
    color: colors.primary,
    marginBottom: 6,
  },
  statusText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.darkGray,
    marginBottom: 8,
  },
  tagRow: {
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  button: {
    alignSelf: 'flex-start',
  },
});
