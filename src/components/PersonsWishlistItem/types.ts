import { ImageSourcePropType, ViewStyle } from 'react-native';

export interface PersonsWishlistItemData {
  id: string;
  title: string;
  description: string;
  price: string;
  image: ImageSourcePropType | string;
  contributedPercent: number;
  /** Optional category for Gift Options screen (e.g. "Home & Kitchen") */
  category?: string;
}

export interface PersonsWishlistItemProps {
  item: PersonsWishlistItemData;
  onPress?: (item: PersonsWishlistItemData) => void;
  onEdit?: (item: PersonsWishlistItemData) => void;
  onDelete?: (item: PersonsWishlistItemData) => void;
  showActions?: boolean;
  /** When false, hides the contributed progress bar. Default: true */
  showContributed?: boolean;
  style?: ViewStyle;
}
