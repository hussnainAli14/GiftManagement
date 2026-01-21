import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tag } from '../Tag';
import { TagsListProps } from './types';
import { colors } from '../../theme';

const TagsList: React.FC<TagsListProps> = ({
  tags,
  backgroundColor,
  textColor,
  borderColor,
  borderWidth,
  borderRadius,
  paddingVertical,
  paddingHorizontal,
  spacing = 8,
  pressable = false,
  onTagPress,
  containerStyle,
  tagStyle,
  tagTextStyle,
}) => {
  const handleTagPress = (tag: string, index: number) => {
    if (onTagPress) {
      onTagPress(tag, index);
    }
  };

  return (
    <View
      style={[
        styles.container,
        containerStyle,
      ]}
    >
      {tags.map((tag, index) => (
        <View
          key={`${tag}-${index}`}
          style={{
            marginRight: spacing,
            marginBottom: spacing,
          }}
        >
          <Tag
            backgroundColor={backgroundColor || colors.lightGray}
            textColor={textColor || colors.darkPurple}
            borderColor={borderColor}
            borderWidth={borderWidth}
            borderRadius={borderRadius}
            paddingVertical={paddingVertical}
            paddingHorizontal={paddingHorizontal}
            pressable={pressable}
            onPress={pressable ? () => handleTagPress(tag, index) : undefined}
            style={tagStyle}
            textStyle={tagTextStyle}
          >
            {tag}
          </Tag>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
});

export default TagsList;
