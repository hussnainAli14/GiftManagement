import { StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { typography } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.darkGray,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    ...typography.textStyles.body,
    fontSize: 16,
    color: colors.black,
    marginBottom: 2,
  },
  optionDescription: {
    ...typography.textStyles.bodySmall,
    fontSize: 14,
    color: colors.darkGray,
    lineHeight: 20,
  },
});
