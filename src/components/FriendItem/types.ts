import { ImageSourcePropType, ViewStyle } from 'react-native';

export interface Friend {
  id: string;
  name: string;
  avatar: ImageSourcePropType | string; // Can be image URI or require() image
  // Add more fields as needed when integrating with real API
  // e.g., email?: string;
  // e.g., status?: 'online' | 'offline';
}

export interface FriendItemProps {
  friend: Friend;
  onPress?: (friend: Friend) => void;
  style?: ViewStyle;
}
