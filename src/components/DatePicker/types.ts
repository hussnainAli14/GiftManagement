import { ReactNode } from 'react';
import { TextStyle, ViewStyle } from 'react-native';

export interface DatePickerProps {
  /**
   * Label text displayed above the date picker
   */
  label?: string;
  
  /**
   * Placeholder text when no date is selected
   */
  placeholder?: string;
  
  /**
   * Selected date (controlled by parent)
   */
  value: Date | null;
  
  /**
   * Callback when date changes
   */
  onChange: (date: Date) => void;
  
  /**
   * Minimum date that can be selected
   */
  minimumDate?: Date;
  
  /**
   * Maximum date that can be selected
   */
  maximumDate?: Date;
  
  /**
   * Date picker mode
   * @default 'date'
   */
  mode?: 'date' | 'time' | 'datetime';
  
  /**
   * Display format for the date
   * @default 'MM/DD/YYYY'
   */
  displayFormat?: string;
  
  /**
   * Error message to display below date picker
   */
  error?: string;
  
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Left icon component (e.g., calendar icon)
   */
  leftIcon?: ReactNode;
  
  /**
   * Custom container style
   */
  containerStyle?: ViewStyle;
  
  /**
   * Custom input container style
   */
  inputContainerStyle?: ViewStyle;
  
  /**
   * Custom label style
   */
  labelStyle?: TextStyle;
  
  /**
   * Custom error text style
   */
  errorStyle?: TextStyle;
  
  /**
   * Custom selected text style
   */
  selectedTextStyle?: TextStyle;
  
  /**
   * Custom placeholder text style
   */
  placeholderStyle?: TextStyle;
  
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
   * Full width date picker
   * @default true
   */
  fullWidth?: boolean;
}
