import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  markAllBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#f7f7f7',
    marginBottom: 10,
  },
  markAllText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 24,
  },
});
