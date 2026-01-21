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
  title: {
    ...typography.textStyles.h3,
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    ...typography.textStyles.body,
    color: '#000000',
    marginBottom: 32,
    lineHeight: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  sendButton: {
    marginTop: 8,
  },
});
