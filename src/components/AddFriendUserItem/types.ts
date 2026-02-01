import { ImageSourcePropType, ViewStyle } from 'react-native';

export interface AddFriendUser {
  id: string;
  name: string;
  avatar: ImageSourcePropType | string;
}

export interface AddFriendUserItemProps {
  user: AddFriendUser;
  onAddFriend?: (user: AddFriendUser) => void;
  onPress?: (user: AddFriendUser) => void;
  style?: ViewStyle;
}
