import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';
import { typography } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 8,
  },
  inputWrap: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
  },
  banner: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff3e0',
  },
  bannerText: {
    fontSize: 12,
    color: colors.darkGray,
    textAlign: 'center',
  },
  list: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleRow: {
    marginVertical: 4,
    maxWidth: '88%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  bubbleRowMine: {
    alignSelf: 'flex-end',
  },
  bubbleRowTheirs: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  msgAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.lightGray,
  },
  bubbleMine: {
    backgroundColor: colors.primary,
  },
  bubbleTheirs: {
    backgroundColor: colors.lightGray,
  },
  bubbleTextMine: {
    ...typography.textStyles.regular,
    fontSize: 16,
    color: colors.white,
  },
  bubbleTextTheirs: {
    ...typography.textStyles.regular,
    fontSize: 16,
    color: colors.black,
  },
  time: {
    fontSize: 11,
    color: colors.darkGray,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeMine: {
    color: 'rgba(255,255,255,0.85)',
    alignSelf: 'flex-end',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
    fontSize: 16,
    color: colors.black,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    opacity: 0.5,
  },
});
