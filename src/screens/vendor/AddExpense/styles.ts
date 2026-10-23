import { StyleSheet } from 'react-native';
import { colors, typography } from '../../../theme';

const VENDOR_BLUE = '#2563EB';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  label: {
    ...typography.textStyles.label,
    color: colors.black,
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  hint: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 18,
  },
  saveButton: {
    backgroundColor: VENDOR_BLUE,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    ...typography.textStyles.button,
    color: colors.white,
    fontSize: 16,
  },
});
