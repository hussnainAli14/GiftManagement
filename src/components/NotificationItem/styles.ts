import { StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { typography } from '../../theme';

export const styles = StyleSheet.create({
  notificationCard: {
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftSection: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lightGray,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleSection: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: '#000000',
    fontWeight: typography.fontWeight.bold as '700',
    marginBottom: 4,
  },
  description: {
    ...typography.textStyles.semiBold,
    color: colors.notificationGray,
    fontSize: 14,
    lineHeight: 20,
  },
  rightSection: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  timestamp: {
    ...typography.textStyles.semiBold,
    color: colors.notificationGray,
    fontSize: 12,
    marginBottom: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
});
