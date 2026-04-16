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
    marginBottom: 6,
    textAlign: 'center',
  },
  friendEmail: {
    ...typography.textStyles.regular,
    fontSize: 15,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
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
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  errorBanner: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#fff3f3',
  },
  errorText: {
    ...typography.textStyles.regular,
    fontSize: 14,
    color: colors.darkGray,
  },
  emptyHint: {
    ...typography.textStyles.regular,
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 8,
  },
});
