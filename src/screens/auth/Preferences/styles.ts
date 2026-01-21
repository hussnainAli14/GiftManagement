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
    paddingTop: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  interestsContainer: {
    marginBottom: 32,
  },
  interestsLabel: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold as '600',
    lineHeight: typography.fontSize.base * 1.5,
    color: '#000000',
    marginBottom: 8,
  },
  interestsDescription: {
    ...typography.textStyles.bodySmall,
    color: '#000000',
    marginBottom: 16,
    lineHeight: 21,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tagWrapper: {
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingTop: 24,
  },
  completeButton: {
    marginBottom: 0,
  },
});
