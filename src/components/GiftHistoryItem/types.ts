import { ViewStyle } from 'react-native';

export type GiftType = 'sent' | 'received';

export interface GiftHistoryItem {
  id: string;
  recipient: string; // For sent gifts
  sender: string; // For received gifts
  date: string;
  type: GiftType;
  icon?: 'gift' | 'shield' | 'heart';
  // Add more fields as needed when integrating with real API
}

export interface GiftHistoryItemProps {
  item: GiftHistoryItem;
  onPress?: (item: GiftHistoryItem) => void;
  style?: ViewStyle;
}
