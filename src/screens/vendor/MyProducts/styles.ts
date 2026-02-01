import { StyleSheet } from 'react-native';
import { colors, typography } from '../../../theme';

const VENDOR_BLUE = '#2563EB';
const DELETE_RED = '#DC2626';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 160,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  productImageFill: {
    width: '100%',
    height: '100%',
  },
  cardBody: {
    padding: 12,
  },
  namePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  productName: {
    ...typography.textStyles.h6,
    color: colors.black,
    flex: 1,
  },
  productPrice: {
    ...typography.textStyles.label,
    color: VENDOR_BLUE,
    fontWeight: '600',
  },
  stockInStock: {
    ...typography.textStyles.caption,
    color: colors.black,
    marginBottom: 12,
  },
  stockLowStock: {
    ...typography.textStyles.caption,
    color: colors.black,
    marginBottom: 12,
  },
  stockOutOfStock: {
    ...typography.textStyles.caption,
    color: colors.white,
    fontWeight: '600',
    backgroundColor: DELETE_RED,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: 8,
    gap: 6,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: DELETE_RED,
    borderRadius: 8,
    gap: 6,
  },
  editButtonText: {
    ...typography.textStyles.label,
    color: colors.textSecondary,
    fontSize: 14,
  },
  deleteButtonText: {
    ...typography.textStyles.label,
    color: colors.white,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 340,
  },
  modalTitle: {
    ...typography.textStyles.body,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: DELETE_RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButtonText: {
    ...typography.textStyles.label,
    color: colors.textSecondary,
    fontSize: 15,
  },
  modalConfirmButtonText: {
    ...typography.textStyles.label,
    color: colors.white,
    fontSize: 15,
  },
});

export const VENDOR_BLUE_COLOR = VENDOR_BLUE;
