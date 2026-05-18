import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  heroImage: {
    width: '100%',
    height: 240,
    backgroundColor: colors.lightGray,
  },
  heroPlaceholder: {
    width: '100%',
    height: 240,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  vendor: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: colors.notificationGray,
    lineHeight: 22,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 12,
  },
  actions: {
    gap: 12,
  },
});
