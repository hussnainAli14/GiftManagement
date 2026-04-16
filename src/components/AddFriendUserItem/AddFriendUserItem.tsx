import React from 'react';
import { Text, Image, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Container } from '../Container';
import { colors } from '../../theme';
import { AddFriendUserItemProps } from './types';
import { styles } from './styles';
import { getAvatarImageSource } from '../../utils/resolveUserAvatar';

const AddFriendUserItem: React.FC<AddFriendUserItemProps> = ({
  user,
  onAddFriend,
  onPress,
  addRequestLoading = false,
  style,
}) => {
  const imageSource = getAvatarImageSource(user.avatar, user.name);
  const email = user.email?.trim();

  return (
    <View style={style}>
      <Container style={styles.container}>
        <TouchableOpacity
          style={styles.leftPressable}
          onPress={() => onPress?.(user)}
          activeOpacity={0.7}
          disabled={!onPress}
        >
          <Image source={imageSource} style={styles.avatar} />
          <View style={styles.textColumn}>
            <Text style={styles.name} numberOfLines={1}>
              {user.name}
            </Text>
            {email ? (
              <Text style={styles.email} numberOfLines={1}>
                {email}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addButton, addRequestLoading && styles.addButtonDisabled]}
          onPress={() => onAddFriend?.(user)}
          activeOpacity={0.7}
          disabled={addRequestLoading}
        >
          {addRequestLoading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Icon name="person-add" size={18} color={colors.white} />
              <Text style={styles.addButtonText}>Add Friend</Text>
            </>
          )}
        </TouchableOpacity>
      </Container>
    </View>
  );
};

export default AddFriendUserItem;
