import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  locationNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
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
  buttonContainer: {
    marginTop: 'auto',
    paddingTop: 24,
  },
  continueButton: {
    marginBottom: 0,
  },
});
