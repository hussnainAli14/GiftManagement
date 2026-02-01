import { StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { typography } from '../../theme';

const STATUS_BG = '#17A2B8';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  content: {
    gap: 8,
  },
  title: {
    ...typography.textStyles.bold,
    fontSize: 16,
    color: colors.black,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    ...typography.textStyles.bodySmall,
    fontSize: 14,
    color: colors.darkGray,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: STATUS_BG,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  statusText: {
    ...typography.textStyles.caption,
    fontSize: 12,
    color: colors.white,
    fontWeight: typography.fontWeight.medium as '500',
  },
});
