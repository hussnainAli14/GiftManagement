import { ImageSourcePropType, ViewStyle } from 'react-native';

export interface AddFriendUser {
  id: string;
  name: string;
  avatar: ImageSourcePropType | string;
  email?: string;
  /** When set by search API — used to hide non-actionable rows client-side as well. */
  friendshipStatus?: 'available' | 'friend' | 'pending';
}

export interface AddFriendUserItemProps {
  user: AddFriendUser;
  onAddFriend?: (user: AddFriendUser) => void | Promise<void>;
  onPress?: (user: AddFriendUser) => void;
  /** True while POST /friendships/request is in flight for this row */
  addRequestLoading?: boolean;
  style?: ViewStyle;
}
