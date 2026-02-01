import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';
import { typography } from '../../../theme';

const deleteRed = '#DC3545';
const deleteBgLight = '#FFE5E5';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  field: {
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
  },
  toggleLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.base,
    color: colors.black,
    flex: 1,
  },
  pricePrefix: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.base,
    color: colors.darkGray,
  },
  buttonRow: {
    marginTop: 24,
    gap: 12,
  },
  updateButton: {
    marginBottom: 0,
  },
  deleteButton: {
    backgroundColor: deleteBgLight,
    borderColor: deleteRed,
    borderWidth: 1,
  },
});

export const deleteButtonColors = {
  backgroundColor: deleteBgLight,
  textColor: deleteRed,
  borderColor: deleteRed,
};
