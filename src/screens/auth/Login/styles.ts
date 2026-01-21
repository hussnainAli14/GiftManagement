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
    paddingBottom: 24,
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: colors.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  forgotPasswordText: {
    ...typography.textStyles.bodySmall,
    color: colors.primary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray,
  },
  dividerText: {
    ...typography.textStyles.bodySmall,
    color: colors.primaryMuted,
    marginHorizontal: 16,
  },
  createAccountButton: {
    marginBottom: 24,
  },
});
