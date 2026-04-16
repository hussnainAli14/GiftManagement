import { StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderGray,
    overflow: 'hidden',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.white,
  },
  tabSelected: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold as '700',
    color: colors.darkGray,
  },
  tabTextSelected: {
    color: colors.white,
  },
});

