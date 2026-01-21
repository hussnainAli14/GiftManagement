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
    alignItems: 'center',
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
    color: colors.darkGray,
    marginBottom: 48,
    textAlign: 'center',
    lineHeight: 24,
  },
  continueButton: {
    width: '100%',
  },
});
