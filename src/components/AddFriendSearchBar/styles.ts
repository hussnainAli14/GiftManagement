import { StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { typography } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 16,
  },
  inputContainer: {
    marginBottom: 0,
  },
  criteriaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  criteriaButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  criteriaButtonSelected: {
    backgroundColor: colors.primaryMuted + '30',
  },
  criteriaButtonUnselected: {
    backgroundColor: colors.lightGray,
  },
  criteriaTextSelected: {
    ...typography.textStyles.semiBold,
    fontSize: 14,
    color: colors.primary,
  },
  criteriaTextUnselected: {
    ...typography.textStyles.bodySmall,
    fontSize: 14,
    color: colors.darkGray,
  },
  searchButton: {
    marginTop: 4,
  },
});
