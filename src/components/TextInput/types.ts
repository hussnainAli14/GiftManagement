import { ReactNode } from 'react';
import { TextInputProps, TextStyle, ViewStyle } from 'react-native';

export interface TextInputComponentProps extends Omit<TextInputProps, 'style'> {
  /**
   * Label text displayed above the input
   */
  label?: string;
  
  /**
   * Placeholder text
   */
  placeholder?: string;
  
  /**
   * Input value (controlled component)
   */
  value: string;
  
  /**
   * Callback when text changes
   */
  onChangeText: (text: string) => void;
  
  /**
   * Left icon component (e.g., envelope, padlock)
   */
  leftIcon?: ReactNode;
  
  /**
   * Right icon component (e.g., eye icon for password visibility)
   */
  rightIcon?: ReactNode;
  
  /**
   * Callback when right icon is pressed
   */
  onRightIconPress?: () => void;
  
  /**
   * Secure text entry (for passwords)
   * @default false
   */
  secureTextEntry?: boolean;
  
  /**
   * Masked input (for verification codes, shows dots)
   * @default false
   */
  masked?: boolean;
  
  /**
   * Number of characters for masked input
   * @default 6
   */
  maskLength?: number;
  
  /**
   * Error message to display below input
   */
  error?: string;
  
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Custom container style
   */
  containerStyle?: ViewStyle;
  
  /**
   * Custom input style
   */
  inputStyle?: TextStyle;
  
  /**
   * Custom label style
   */
  labelStyle?: TextStyle;
  
  /**
   * Custom error text style
   */
  errorStyle?: TextStyle;
  
  /**
   * Border color (overrides default)
   */
  borderColor?: string;
  
  /**
   * Border color when focused
   */
  focusedBorderColor?: string;
  
  /**
   * Border color when error
   */
  errorBorderColor?: string;
  
  /**
   * Background color
   */
  backgroundColor?: string;
  
  /**
   * Text color
   */
  textColor?: string;
  
  /**
   * Placeholder text color
   */
  placeholderTextColor?: string;
  
  /**
   * Border radius
   * @default 8
   */
  borderRadius?: number;
  
  /**
   * Border width
   * @default 1
   */
  borderWidth?: number;
  
  /**
   * Padding vertical
   * @default 12
   */
  paddingVertical?: number;
  
  /**
   * Padding horizontal
   * @default 16
   */
  paddingHorizontal?: number;
  
  /**
   * Full width input
   * @default true
   */
  fullWidth?: boolean;
  
  /**
   * Auto focus on mount
   * @default false
   */
  autoFocus?: boolean;
  
  /**
   * Keyboard type
   */
  keyboardType?: TextInputProps['keyboardType'];
  
  /**
   * Auto capitalize
   */
  autoCapitalize?: TextInputProps['autoCapitalize'];
  
  /**
   * Max length
   */
  maxLength?: number;
}
