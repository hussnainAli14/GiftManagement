import { StyleSheet } from 'react-native';
import { colors, typography } from '../../../theme';

const VENDOR_BLUE = '#2563EB';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    ...typography.textStyles.h5,
    color: colors.black,
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputContainerLast: {
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  rowLast: {
    marginBottom: 0,
  },
  halfInput: {
    flex: 1,
  },
  mediaPreview: {
    width: '100%',
    aspectRatio: 1,
    maxHeight: 200,
    borderRadius: 12,
    backgroundColor: colors.lightGray,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaActions: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    gap: 10,
    zIndex: 2,
  },
  mediaActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaActionBtnDanger: {
    backgroundColor: 'rgba(220,38,38,0.85)',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: 8,
    gap: 8,
  },
  changePhotoButtonText: {
    ...typography.textStyles.label,
    color: colors.textSecondary,
    fontSize: 14,
  },
  thumbRow: {
    paddingVertical: 10,
    gap: 10,
  },
  thumbWrap: {
    width: 64,
    height: 64,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderGray,
    backgroundColor: colors.lightGray,
  },
  thumbWrapSelected: {
    borderColor: VENDOR_BLUE,
    borderWidth: 2,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: VENDOR_BLUE,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    ...typography.textStyles.button,
    color: colors.black,
  },
  saveButtonText: {
    ...typography.textStyles.button,
    color: colors.white,
  },
});

export const VENDOR_BLUE_COLOR = VENDOR_BLUE;
