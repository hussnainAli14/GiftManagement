import { TextStyle, ViewStyle } from 'react-native';

export interface TagsListProps {
  /**
   * Array of tag labels to display
   */
  tags: string[];
  
  /**
   * Background color for all tags (managed by parent)
   * @default colors.lightGray
   */
  backgroundColor?: string;
  
  /**
   * Text color for all tags (managed by parent)
   * @default colors.darkPurple
   */
  textColor?: string;
  
  /**
   * Border color for all tags
   */
  borderColor?: string;
  
  /**
   * Border width
   * @default 0
   */
  borderWidth?: number;
  
  /**
   * Border radius for all tags
   * @default 16
   */
  borderRadius?: number;
  
  /**
   * Padding vertical for all tags
   * @default 6
   */
  paddingVertical?: number;
  
  /**
   * Padding horizontal for all tags
   * @default 12
   */
  paddingHorizontal?: number;
  
  /**
   * Spacing between tags
   * @default 8
   */
  spacing?: number;
  
  /**
   * Make tags pressable
   * @default false
   */
  pressable?: boolean;
  
  /**
   * Callback when a tag is pressed
   */
  onTagPress?: (tag: string, index: number) => void;
  
  /**
   * Custom container style
   */
  containerStyle?: ViewStyle;
  
  /**
   * Custom tag style (applied to all tags)
   */
  tagStyle?: ViewStyle;
  
  /**
   * Custom tag text style (applied to all tags)
   */
  tagTextStyle?: TextStyle;
}
