import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';
import { typography } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  searchSection: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.textStyles.bold,
    fontSize: 20,
    color: colors.black,
    marginBottom: 16,
  },
  searchStatusRow: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    alignItems: 'center',
    minHeight: 40,
    justifyContent: 'center',
  },
  emptySearchText: {
    ...typography.textStyles.regular,
    fontSize: 15,
    color: colors.darkGray,
    textAlign: 'center',
    lineHeight: 22,
  },
});
