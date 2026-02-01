import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Container } from '../Container';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { NotificationItemProps } from './types';
import { styles } from './styles';

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
  style,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(notification);
    }
  };

  const renderAvatar = () => {
    if (notification.avatar) {
      // If avatar is a string (URI), use Image with source={{ uri: ... }}
      // If avatar is a require() image, use Image with source={avatar}
      const imageSource =
        typeof notification.avatar === 'string'
          ? { uri: notification.avatar }
          : notification.avatar;

      return (
        <Image source={imageSource} style={styles.avatar} />
      );
    }

    // Render themed icon based on notification.icon
    if (notification.icon === 'gift') {
      return (
        <View style={styles.iconContainer}>
          <Icon name="card-giftcard" size={24} color={colors.primary} />
        </View>
      );
    }

    if (notification.icon === 'bell') {
      return (
        <View style={styles.iconContainer}>
          <Icon name="notifications" size={24} color={colors.primary} />
        </View>
      );
    }

    if (notification.icon === 'order') {
      return (
        <View style={styles.iconContainer}>
          <Icon name="local-shipping" size={24} color={colors.primary} />
        </View>
      );
    }

    // Default: gift icon
    return (
      <View style={styles.iconContainer}>
        <Icon name="card-giftcard" size={24} color={colors.primary} />
      </View>
    );
  };

  const content = (
    <Container style={[styles.notificationCard, style]}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {renderAvatar()}
        </View>
        <View style={styles.middleSection}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.description}>{notification.description}</Text>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.timestamp}>{notification.timestamp}</Text>
          {notification.isUnread && <View style={styles.unreadDot} />}
        </View>
      </View>
    </Container>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default NotificationItem;
