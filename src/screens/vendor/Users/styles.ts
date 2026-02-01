import { StyleSheet } from 'react-native';
import { colors, typography } from '../../../theme';

const VENDOR_BLUE = '#2563EB';
const STATUS_ACTIVE = '#2563EB';
const STATUS_SUSPENDED = '#DC2626';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchWrapper: {
    flex: 1,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGray,
    gap: 6,
  },
  filterButtonText: {
    ...typography.textStyles.label,
    color: colors.textSecondary,
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lightGray,
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    ...typography.textStyles.h6,
    color: colors.black,
    marginBottom: 2,
  },
  userEmail: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statusActive: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: STATUS_ACTIVE,
  },
  statusSuspended: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: STATUS_SUSPENDED,
  },
  statusText: {
    ...typography.textStyles.caption,
    color: colors.white,
    fontWeight: '600',
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  /* Modals */
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
    ...typography.textStyles.h5,
    color: colors.black,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalDetailRow: {
    marginBottom: 12,
  },
  modalDetailLabel: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  modalDetailValue: {
    ...typography.textStyles.bodySmall,
    color: colors.black,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
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
    backgroundColor: STATUS_SUSPENDED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButtonText: {
    ...typography.textStyles.label,
    color: colors.black,
    fontSize: 15,
  },
  modalCloseButtonText: {
    ...typography.textStyles.label,
    color: colors.black,
    fontSize: 15,
    fontWeight: '600',
  },
  modalConfirmButtonText: {
    ...typography.textStyles.label,
    color: colors.white,
    fontSize: 15,
  },
});
