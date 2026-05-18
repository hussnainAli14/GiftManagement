import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  avatarSection: {
    marginBottom: 16,
  },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.lightGray,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 6,
  },
  avatarPickBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  bigInputText: {
    fontSize: 16,
    color: colors.notificationGray,
  },
  locationSection: {
    marginBottom: 16,
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 8,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  locationInputDisabled: {
    opacity: 0.7,
  },
  locationInputText: {
    flex: 1,
    fontSize: 16,
    color: colors.notificationGray,
  },
  locationPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: colors.textSecondary,
  },
  locationNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
  },
  locationNoticeText: {
    flex: 1,
    fontSize: 13,
    color: colors.darkGray,
    lineHeight: 18,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 18,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});

