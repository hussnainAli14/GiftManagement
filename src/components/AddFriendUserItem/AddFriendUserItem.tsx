import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Container } from '../Container';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { AddFriendUserItemProps } from './types';
import { styles } from './styles';

const AddFriendUserItem: React.FC<AddFriendUserItemProps> = ({
  user,
  onAddFriend,
  onPress,
  style,
}) => {
  const imageSource =
    typeof user.avatar === 'string'
      ? { uri: user.avatar }
      : user.avatar;

  const handleItemPress = () => {
    onPress?.(user);
  };

  const handleAddFriendPress = (e: any) => {
    e?.stopPropagation?.();
    onAddFriend?.(user);
  };

  return (
    <TouchableOpacity
      onPress={handleItemPress}
      activeOpacity={0.7}
      style={style}
    >
      <Container style={styles.container}>
        <Image source={imageSource} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddFriendPress}
          activeOpacity={0.7}
        >
          <Icon name="person-add" size={18} color={colors.white} />
          <Text style={styles.addButtonText}>Add Friend</Text>
        </TouchableOpacity>
      </Container>
    </TouchableOpacity>
  );
};

export default AddFriendUserItem;
