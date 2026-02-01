import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';
import { typography } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  filterTag: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGray,
  },
  filterTagSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterTagText: {
    ...typography.textStyles.semiBold,
    fontSize: 14,
    color: colors.darkGray,
  },
  filterTagTextSelected: {
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});
