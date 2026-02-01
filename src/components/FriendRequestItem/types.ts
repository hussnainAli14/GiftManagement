import { ImageSourcePropType, ViewStyle } from 'react-native';

export type RequestType = 'incoming' | 'outgoing';

export interface FriendRequest {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  avatar: ImageSourcePropType | string;
  mutualFriendsCount: number;
  type: RequestType;
}

export interface FriendRequestItemProps {
  request: FriendRequest;
  onAccept?: (request: FriendRequest) => void;
  onDecline?: (request: FriendRequest) => void;
  onCancel?: (request: FriendRequest) => void;
  onPress?: (request: FriendRequest) => void;
  style?: ViewStyle;
}
