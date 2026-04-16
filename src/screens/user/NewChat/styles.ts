import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';
import { typography } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  hint: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...typography.textStyles.body,
    color: colors.darkGray,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: colors.lightGray,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    ...typography.textStyles.bold,
    fontSize: 16,
    color: colors.black,
    marginBottom: 2,
  },
  email: {
    ...typography.textStyles.bodySmall,
    fontSize: 14,
    color: colors.darkGray,
  },
});
