import React from 'react';
import { Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { FriendItemProps } from './types';
import { styles } from './styles';

const FriendItem: React.FC<FriendItemProps> = ({
  friend,
  onPress,
  style,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(friend);
    }
  };

  const imageSource =
    typeof friend.avatar === 'string'
      ? { uri: friend.avatar }
      : friend.avatar;

  const content = (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[styles.container, style]}
    >
      <Image source={imageSource} style={styles.avatar} />
      <Text style={styles.name}>{friend.name}</Text>
      <Icon name="chevron-right" size={24} color={colors.darkGray} />
    </TouchableOpacity>
  );

  return content;
};

export default FriendItem;
