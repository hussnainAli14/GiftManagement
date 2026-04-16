import { ImageSourcePropType, ViewStyle } from 'react-native';

export interface Friend {
  id: string;
  name: string;
  avatar: ImageSourcePropType | string;
  email?: string;
}

export interface FriendItemProps {
  friend: Friend;
  onPress?: (friend: Friend) => void;
  style?: ViewStyle;
}
