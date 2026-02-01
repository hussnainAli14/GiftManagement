import { StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { typography } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lightGray,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    marginBottom: 4,
  },
  nameBold: {
    ...typography.textStyles.bold,
    fontSize: 16,
    color: colors.black,
  },
  nameRegular: {
    ...typography.textStyles.regular,
    fontSize: 16,
    color: colors.black,
  },
  mutualText: {
    ...typography.textStyles.bodySmall,
    fontSize: 14,
    color: colors.darkGray,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  acceptButton: {
    minWidth: 80,
  },
  declineButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  declineText: {
    ...typography.textStyles.semiBold,
    fontSize: 14,
    color: colors.primary,
  },
  cancelButton: {
    minWidth: 80,
  },
});
