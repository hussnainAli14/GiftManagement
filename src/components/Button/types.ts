import { ReactNode } from 'react';
import { TouchableOpacityProps, TextStyle, ViewStyle } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'primaryPurple' | 'secondaryPurple';

export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style' | 'disabled'> {
  /**
   * Button text content
   */
  children: ReactNode;
  
  /**
   * Button variant style
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * Button size
   * @default 'medium'
   */
  size?: ButtonSize;
  
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Custom background color (overrides variant default)
   */
  backgroundColor?: string;
  
  /**
   * Custom text color (overrides variant default)
   */
  textColor?: string;
  
  /**
   * Custom border color (for secondary variant)
   */
  borderColor?: string;
  
  /**
   * Custom padding (overrides size default)
   */
  paddingVertical?: number;
  paddingHorizontal?: number;
  
  /**
   * Custom border width (for secondary variant)
   * @default 1
   */
  borderWidth?: number;
  
  /**
   * Custom border radius
   */
  borderRadius?: number;
  
  /**
   * Full width button
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Custom container style
   */
  style?: ViewStyle;
  
  /**
   * Custom text style
   */
  textStyle?: TextStyle;
  
  /**
   * Loading state (can be used with disabled)
   */
  loading?: boolean;
}
