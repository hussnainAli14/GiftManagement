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
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.lightGray,
    marginBottom: 16,
  },
  friendName: {
    ...typography.textStyles.bold,
    fontSize: 24,
    color: colors.black,
    marginBottom: 16,
  },
  profileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  messageButtonText: {
    ...typography.textStyles.button,
    color: colors.white,
    fontSize: 14,
  },
  moreButton: {
    padding: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.textStyles.bold,
    fontSize: 20,
    color: colors.black,
  },
  viewAllText: {
    ...typography.textStyles.semiBold,
    fontSize: 14,
    color: colors.primary,
  },
  horizontalList: {
    paddingRight: 24,
  },
});
