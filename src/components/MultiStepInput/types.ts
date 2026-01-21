import { TextStyle, ViewStyle } from 'react-native';

export interface MultiStepInputProps {
  /**
   * Number of input steps/boxes
   * @default 6
   */
  steps?: number;
  
  /**
   * Current value (array of characters or string)
   */
  value: string;
  
  /**
   * Callback when value changes
   */
  onChangeText: (value: string) => void;
  
  /**
   * Label text displayed above the inputs
   */
  label?: string;
  
  /**
   * Error message to display below inputs
   */
  error?: string;
  
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Auto focus first input on mount
   * @default false
   */
  autoFocus?: boolean;
  
  /**
   * Keyboard type
   * @default 'number-pad'
   */
  keyboardType?: 'default' | 'number-pad' | 'numeric';
  
  /**
   * Whether to mask the input (show dots)
   * @default false
   */
  masked?: boolean;
  
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
   * Size of each input box
   * @default 48
   */
  boxSize?: number;
  
  /**
   * Spacing between boxes
   * @default 8
   */
  spacing?: number;
  
  /**
   * Custom container style
   */
  containerStyle?: ViewStyle;
  
  /**
   * Custom label style
   */
  labelStyle?: TextStyle;
  
  /**
   * Custom error text style
   */
  errorStyle?: TextStyle;
  
  /**
   * Custom input box style
   */
  inputStyle?: TextStyle;
  
  /**
   * Callback when all steps are filled
   */
  onComplete?: (value: string) => void;
  
  /**
   * Callback when input is focused
   */
  onFocus?: (index: number) => void;
  
  /**
   * Callback when input is blurred
   */
  onBlur?: (index: number) => void;
}
