import { StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { typography } from '../../theme';

export const styles = StyleSheet.create({
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
    ...typography.textStyles.body,
    color: colors.black,
    fontSize: 14,
  },
  eventName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: '#000000',
    fontWeight: typography.fontWeight.bold as '700',
  },
});
