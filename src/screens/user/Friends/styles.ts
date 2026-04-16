import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';
import { typography } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
  },
  title: {
    ...typography.textStyles.bold,
    fontSize: 24,
    color: colors.black,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  iconWrap: {
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  notifBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    includeFontPadding: false,
  },
  searchContainer: {
    paddingHorizontal: 0,
    paddingBottom: 12,
  },
  requestsSection: {
    paddingHorizontal: 0,
    paddingBottom: 8,
  },
  sectionTitle: {
    ...typography.textStyles.bold,
    fontSize: 18,
    color: colors.black,
    marginBottom: 12,
  },
  friendsSubheading: {
    ...typography.textStyles.bold,
    fontSize: 18,
    color: colors.black,
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 0,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  emptyFriendsHint: {
    ...typography.textStyles.regular,
    fontSize: 15,
    color: colors.darkGray,
    textAlign: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
});
