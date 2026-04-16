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
    paddingTop: 18,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.lightGray,
    overflow: 'hidden',
    marginBottom: 10,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
  },
  email: {
    marginTop: 2,
    fontSize: 13,
    color: colors.notificationGray,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 16,
  },
  editBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: 14,
    padding: 14,
    backgroundColor: colors.white,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
  },
  label: {
    fontSize: 13,
    color: colors.notificationGray,
  },
  value: {
    fontSize: 13,
    color: colors.darkGray,
    maxWidth: '70%',
    textAlign: 'right',
  },
});

