import { ViewStyle } from 'react-native';

export interface Event {
  id: string;
  name: string;
  dateTime: string;
  // Add more fields as needed when integrating with real API
  // e.g., description?: string;
  // e.g., location?: string;
  // e.g., userId?: string;
}

export interface EventCardProps {
  event: Event;
  onPress?: (event: Event) => void;
  style?: ViewStyle;
}
