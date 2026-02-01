import { ViewStyle } from 'react-native';

export interface RadioOption<T = string> {
  value: T;
  label: string;
  description?: string;
}

export interface RadioButtonProps<T = string> {
  options: RadioOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  disabled?: boolean;
  containerStyle?: ViewStyle;
}
