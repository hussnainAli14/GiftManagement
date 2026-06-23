import { Alert } from 'react-native';
import { deleteEventApi } from '../api/eventApi';

type OwnEventActionHandlers = {
  eventName: string;
  eventId: string;
  onViewWishlist: () => void;
  onEdit: () => void;
  onDeleted: () => void;
};

export function showOwnEventActions({
  eventName,
  eventId,
  onViewWishlist,
  onEdit,
  onDeleted,
}: OwnEventActionHandlers) {
  Alert.alert(eventName, 'What would you like to do?', [
    { text: 'View Wishlist', onPress: onViewWishlist },
    { text: 'Edit Event', onPress: onEdit },
    {
      text: 'Delete Event',
      style: 'destructive',
      onPress: () => {
        Alert.alert(
          'Delete Event',
          `Are you sure you want to delete "${eventName}"? This cannot be undone.`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: async () => {
                try {
                  await deleteEventApi(eventId);
                  onDeleted();
                } catch (error) {
                  Alert.alert(
                    'Could not delete event',
                    error instanceof Error ? error.message : 'Please try again.',
                  );
                }
              },
            },
          ],
        );
      },
    },
    { text: 'Cancel', style: 'cancel' },
  ]);
}
