import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TagProps } from './types';
import { getTagStyles } from './styles';

const Tag: React.FC<TagProps> = ({
  children,
  backgroundColor,
  textColor,
  borderColor,
  borderWidth,
  borderRadius,
  paddingVertical,
  paddingHorizontal,
  style,
  textStyle,
  pressable = false,
  onPress,
}) => {
  const tagStyles = getTagStyles({
    backgroundColor,
    textColor,
    borderColor,
    borderWidth,
    borderRadius,
    paddingVertical,
    paddingHorizontal,
  });

  const content = (
    <View style={[tagStyles.container, style]}>
      <Text style={[tagStyles.text, textStyle]}>
        {children}
      </Text>
    </View>
  );

  if (pressable && onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default Tag;
