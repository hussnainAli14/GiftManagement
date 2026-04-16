import { StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { typography } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  leftPressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    minWidth: 0,
    marginRight: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lightGray,
    marginRight: 12,
    marginTop: 2,
  },
  textColumn: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    ...typography.textStyles.bold,
    fontSize: 16,
    color: colors.black,
    marginBottom: 2,
  },
  email: {
    ...typography.textStyles.bodySmall,
    fontSize: 14,
    color: colors.darkGray,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.85,
  },
  addButtonText: {
    ...typography.textStyles.button,
    color: colors.white,
    fontSize: 14,
  },
});
