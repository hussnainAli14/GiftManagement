import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';
import { typography } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
    backgroundColor: colors.lightGray,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    ...typography.textStyles.bold,
    fontSize: 16,
    color: colors.black,
    flex: 1,
    marginRight: 8,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  preview: {
    ...typography.textStyles.bodySmall,
    fontSize: 14,
    color: colors.darkGray,
  },
  previewUnread: {
    ...typography.textStyles.semiBold,
    color: colors.black,
  },
  empty: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.textStyles.body,
    color: colors.darkGray,
    textAlign: 'center',
  },
});
