import { ViewStyle } from 'react-native';
import { colors } from '../../theme';
import { ContainerProps } from './types';

export const getContainerStyles = ({
  backgroundColor = colors.white,
  borderRadius = 10,
  padding = 16,
  paddingVertical,
  paddingHorizontal,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  shadowColor = 'rgba(0, 0, 0, 0.1)',
  shadowOffset = { width: 0, height: 2 },
  shadowOpacity = 0.1,
  shadowRadius = 5,
  elevation = 2,
}: Pick<
  ContainerProps,
  | 'backgroundColor'
  | 'borderRadius'
  | 'padding'
  | 'paddingVertical'
  | 'paddingHorizontal'
  | 'paddingTop'
  | 'paddingRight'
  | 'paddingBottom'
  | 'paddingLeft'
  | 'shadowColor'
  | 'shadowOffset'
  | 'shadowOpacity'
  | 'shadowRadius'
  | 'elevation'
>): ViewStyle => {
  const containerStyle: ViewStyle = {
    backgroundColor,
    borderRadius,
    paddingTop: paddingTop ?? paddingVertical ?? padding,
    paddingRight: paddingRight ?? paddingHorizontal ?? padding,
    paddingBottom: paddingBottom ?? paddingVertical ?? padding,
    paddingLeft: paddingLeft ?? paddingHorizontal ?? padding,
    borderWidth: 1,
    borderColor: colors.darkGray,
    // iOS shadow properties
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    // Android elevation
    elevation,
  };

  return containerStyle;
};
