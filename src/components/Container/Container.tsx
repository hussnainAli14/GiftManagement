import React from 'react';
import { View } from 'react-native';
import { ContainerProps } from './types';
import { getContainerStyles } from './styles';

const Container: React.FC<ContainerProps> = ({
  children,
  backgroundColor,
  borderRadius,
  padding,
  paddingVertical,
  paddingHorizontal,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  shadowColor,
  shadowOffset,
  shadowOpacity,
  shadowRadius,
  elevation,
  style,
  ...viewProps
}) => {
  const containerStyles = getContainerStyles({
    backgroundColor,
    borderRadius,
    padding,
    paddingVertical,
    paddingHorizontal,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    elevation,
  });

  return (
    <View style={[containerStyles, style]} {...viewProps}>
      {children}
    </View>
  );
};

export default Container;
