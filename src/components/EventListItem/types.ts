import { ViewStyle } from 'react-native';

export type EventStatus = 'upcoming' | 'past' | 'draft';

export interface EventListItemData {
  id: string;
  title: string;
  date: string;
  status: EventStatus;
  // Add more fields as needed when integrating with real API
}

export interface EventListItemProps {
  event: EventListItemData;
  onPress?: (event: EventListItemData) => void;
  style?: ViewStyle;
}
