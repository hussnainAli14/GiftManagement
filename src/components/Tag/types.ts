import { ReactNode } from 'react';
import { ViewStyle, TextStyle } from 'react-native';

export interface TagProps {
  /**
   * Tag text content
   */
  children: ReactNode;
  
  /**
   * Background color (managed by parent, defaults to white)
   * @default colors.white
   */
  backgroundColor?: string;
  
  /**
   * Text color (managed by parent, defaults to darkPurple)
   * @default colors.darkPurple
   */
  textColor?: string;
  
  /**
   * Border color
   */
  borderColor?: string;
  
  /**
   * Border width
   * @default 0
   */
  borderWidth?: number;
  
  /**
   * Border radius
   * @default 16
   */
  borderRadius?: number;
  
  /**
   * Padding vertical
   * @default 6
   */
  paddingVertical?: number;
  
  /**
   * Padding horizontal
   * @default 12
   */
  paddingHorizontal?: number;
  
  /**
   * Custom container style
   */
  style?: ViewStyle;
  
  /**
   * Custom text style
   */
  textStyle?: TextStyle;
  
  /**
   * Pressable tag (adds onPress handler)
   * @default false
   */
  pressable?: boolean;
  
  /**
   * Callback when tag is pressed (only if pressable is true)
   */
  onPress?: () => void;
}
