import { ViewStyle } from 'react-native';
import { TextInputComponentProps } from '../TextInput/types';

export interface SearchProps extends Omit<TextInputComponentProps, 'leftIcon' | 'rightIcon' | 'onRightIconPress' | 'secureTextEntry' | 'masked' | 'label' | 'error'> {
  /**
   * Placeholder text
   * @default 'Search...'
   */
  placeholder?: string;
  
  /**
   * Custom container style
   */
  containerStyle?: ViewStyle;
}
