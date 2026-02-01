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
