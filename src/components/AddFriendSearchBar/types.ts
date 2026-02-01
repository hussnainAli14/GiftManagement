import { ViewStyle } from 'react-native';

export type SearchCriteria = 'username' | 'phone' | 'email';

export interface AddFriendSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  selectedCriteria: SearchCriteria;
  onCriteriaChange: (criteria: SearchCriteria) => void;
  onSearch: () => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
}
