import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 6,
  },
  updated: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 16,
  },
  h2: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
    marginTop: 14,
    marginBottom: 8,
  },
  p: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.darkGray,
  },
});

