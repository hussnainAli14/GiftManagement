import { ReactNode } from 'react';
import { StyleProp, ViewProps, ViewStyle } from 'react-native';

export interface ContainerProps extends Omit<ViewProps, 'style'> {
  /**
   * Container content
   */
  children: ReactNode;

  /**
   * Background color
   * @default '#FFFFFF'
   */
  backgroundColor?: string;

  /**
   * Border radius
   * @default 10
   */
  borderRadius?: number;

  /**
   * Padding value (applied uniformly to all sides)
   * @default 16
   */
  padding?: number;

  /**
   * Padding vertical (overrides padding if provided)
   */
  paddingVertical?: number;

  /**
   * Padding horizontal (overrides padding if provided)
   */
  paddingHorizontal?: number;

  /**
   * Padding top
   */
  paddingTop?: number;

  /**
   * Padding right
   */
  paddingRight?: number;

  /**
   * Padding bottom
   */
  paddingBottom?: number;

  /**
   * Padding left
   */
  paddingLeft?: number;

  /**
   * Shadow color (iOS)
   * @default 'rgba(0, 0, 0, 0.1)'
   */
  shadowColor?: string;

  /**
   * Shadow offset (iOS)
   * @default { width: 0, height: 2 }
   */
  shadowOffset?: { width: number; height: number };

  /**
   * Shadow opacity (iOS)
   * @default 0.1
   */
  shadowOpacity?: number;

  /**
   * Shadow radius (iOS)
   * @default 5
   */
  shadowRadius?: number;

  /**
   * Elevation (Android)
   * @default 2
   */
  elevation?: number;

  /**
   * Custom container style (merged with default styles)
   */
  style?: StyleProp<ViewStyle>;
}
