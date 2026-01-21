import { TextStyle, ViewStyle } from 'react-native';

export interface DropdownOption {
  /**
   * Label to display in dropdown
   */
  label: string;
  
  /**
   * Value of the option
   */
  value: string | number;
}

export interface DropdownProps {
  /**
   * Label text displayed above the dropdown
   */
  label?: string;
  
  /**
   * Placeholder text when no value is selected
   */
  placeholder?: string;
  
  /**
   * Selected value (controlled by parent)
   */
  value: string | number | null;
  
  /**
   * Callback when value changes
   */
  onChange: (value: string | number) => void;
  
  /**
   * Array of dropdown options
   */
  data: DropdownOption[];
  
  /**
   * Error message to display below dropdown
   */
  error?: string;
  
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Searchable dropdown
   * @default false
   */
  searchable?: boolean;
  
  /**
   * Placeholder for search input
   */
  searchPlaceholder?: string;
  
  /**
   * Custom container style
   */
  containerStyle?: ViewStyle;
  
  /**
   * Custom dropdown style
   */
  dropdownStyle?: ViewStyle;
  
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
   * Full width dropdown
   * @default true
   */
  fullWidth?: boolean;
  
  /**
   * Dropdown item height
   * @default 50
   */
  itemHeight?: number;
  
  /**
   * Maximum height of dropdown list
   * @default 300
   */
  maxHeight?: number;
}
