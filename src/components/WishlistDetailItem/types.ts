import { ImageSourcePropType, ViewStyle } from 'react-native';

export type WishlistDetailTag = 'Available' | 'Gifted';

export interface WishlistDetailItemData {
  id: string;
  title: string;
  price: string;
  image: ImageSourcePropType | string;
  statusText: string;
  tag?: WishlistDetailTag;
  /** Optional category value for pre-filling edit form */
  categoryValue?: string | number;
}

export interface WishlistDetailItemProps {
  item: WishlistDetailItemData;
  onViewDetails?: (item: WishlistDetailItemData) => void;
  onEdit?: (item: WishlistDetailItemData) => void;
  style?: ViewStyle;
}
