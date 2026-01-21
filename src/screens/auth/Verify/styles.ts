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
    paddingTop: 16,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 32,
  },
  bannerText: {
    ...typography.textStyles.bodySmall,
    color: colors.white,
    marginLeft: 8,
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.lightGray,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    ...typography.textStyles.h2,
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    ...typography.textStyles.body,
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 24,
  },
  emailText: {
    ...typography.textStyles.body,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold as '700',
    color: '#000000',
  },
  subDescription: {
    ...typography.textStyles.bodySmall,
    color: '#000000',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 21,
  },
  codeInputContainer: {
    marginBottom: 24,
  },
  verifyButton: {
    marginBottom: 24,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  resendText: {
    ...typography.textStyles.body,
    color: colors.primary,
  },
  resendMessage: {
    ...typography.textStyles.bodySmall,
    color: colors.primary,
    textAlign: 'center',
    marginTop: 8,
  },
});
