import { ImageSourcePropType, ViewStyle } from 'react-native';

export type WishlistStatus = 'Pending' | 'Fulfilled';

export interface WishlistItem {
  id: string;
  title: string;
  price: string;
  image: ImageSourcePropType | string; // Can be image URI or require() image
  status: WishlistStatus;
  // Add more fields as needed when integrating with real API
}

export interface WishlistItemProps {
  item: WishlistItem;
  onPress?: (item: WishlistItem) => void;
  style?: ViewStyle;
}
