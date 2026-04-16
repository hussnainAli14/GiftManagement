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
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.white,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  greeting: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 20,
    color: '#000000',
    fontWeight: typography.fontWeight.bold as '700',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg,
    color: '#000000',
    fontWeight: typography.fontWeight.bold as '700',
    marginTop: 24,
    marginBottom: 16,
  },
  firstSectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg,
    color: '#000000',
    fontWeight: typography.fontWeight.bold as '700',
    marginTop: 0,
    marginBottom: 16,
  },
  eventsLoading: {
    marginVertical: 16,
    alignSelf: 'flex-start',
  },
  emptyEventsMessage: {
    ...typography.textStyles.body,
    fontSize: 15,
    color: colors.darkGray,
    lineHeight: 22,
    marginBottom: 8,
  },
  eventCard: {
    marginBottom: 16,
  },
  eventContent: {
    gap: 8,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDate: {
    ...typography.textStyles.bodySmall,
    color: colors.darkGray,
    fontSize: 14,
  },
  eventName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: '#000000',
    fontWeight: typography.fontWeight.bold as '700',
  },
});
