import { ImageSourcePropType, ViewStyle } from 'react-native';

export interface HorizontalEvent {
  id: string;
  title: string;
  date: string;
  image: ImageSourcePropType | string; // Can be image URI or require() image
  // Add more fields as needed when integrating with real API
}

export interface HorizontalEventCardProps {
  event: HorizontalEvent;
  onPress?: (event: HorizontalEvent) => void;
  style?: ViewStyle;
}
