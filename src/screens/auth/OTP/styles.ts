import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';
import { typography } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  instructionText: {
    ...typography.textStyles.body,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  otpContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  verifyButton: {
    marginBottom: 24,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    ...typography.textStyles.body,
    color: colors.primary,
  },
  resendMessage: {
    ...typography.textStyles.bodySmall,
    color: colors.primary,
    textAlign: 'center',
    marginTop: 16,
  },
});
