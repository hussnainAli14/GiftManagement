import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Button } from '../Button';
import { FriendRequestItemProps } from './types';
import { styles } from './styles';
import { getAvatarImageSource } from '../../utils/resolveUserAvatar';

const FriendRequestItem: React.FC<FriendRequestItemProps> = ({
  request,
  onAccept,
  onDecline,
  onCancel,
  onPress,
  style,
}) => {
  const imageSource = getAvatarImageSource(request.avatar, request.name);

  const mutualText =
    request.mutualFriendsCount === 1
      ? '1 mutual friend'
      : `${request.mutualFriendsCount} mutual friends`;

  const email = request.peerEmail?.trim();

  const content = (
    <TouchableOpacity
      onPress={() => onPress?.(request)}
      activeOpacity={0.7}
      style={[styles.container, style]}
    >
      <Image source={imageSource} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>
          <Text style={styles.nameBold}>{request.firstName} </Text>
          <Text style={styles.nameRegular}>{request.lastName}</Text>
        </Text>
        {email ? (
          <Text style={styles.emailText} numberOfLines={1}>
            {email}
          </Text>
        ) : null}
        <Text style={styles.mutualText}>{mutualText}</Text>
      </View>
      <View style={styles.actions}>
        {request.type === 'incoming' && (
          <>
            <Button
              variant="primary"
              onPress={() => onAccept?.(request)}
              style={styles.acceptButton}
              paddingVertical={8}
              paddingHorizontal={16}
            >
              Accept
            </Button>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={() => onDecline?.(request)}
            >
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
          </>
        )}
        {request.type === 'outgoing' && (
          <Button
            variant="primary"
            backgroundColor="#DC3545"
            onPress={() => onCancel?.(request)}
            style={styles.cancelButton}
            paddingVertical={8}
            paddingHorizontal={16}
          >
            Cancel
          </Button>
        )}
      </View>
    </TouchableOpacity>
  );

  return content;
};

export default FriendRequestItem;
