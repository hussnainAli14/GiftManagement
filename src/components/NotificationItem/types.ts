import { ImageSourcePropType, ViewStyle } from 'react-native';

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  isUnread: boolean;
  avatar?: ImageSourcePropType | string; // Can be image URI or require() image
  icon?: 'gift' | 'bell' | 'order'; // For themed icons when no avatar
}

export interface NotificationItemProps {
  notification: Notification;
  onPress?: (notification: Notification) => void;
  style?: ViewStyle;
}
