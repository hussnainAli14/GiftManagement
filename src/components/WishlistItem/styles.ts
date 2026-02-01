import { StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { typography } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    width: 180,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: colors.lightGray,
  },
  content: {
    padding: 12,
  },
  title: {
    ...typography.textStyles.bold,
    fontSize: 16,
    color: colors.black,
    marginBottom: 6,
  },
  price: {
    ...typography.textStyles.semiBold,
    fontSize: 16,
    color: colors.black,
    marginBottom: 8,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    ...typography.textStyles.caption,
    fontSize: 12,
    color: colors.white,
    fontWeight: typography.fontWeight.medium as '500',
  },
});
