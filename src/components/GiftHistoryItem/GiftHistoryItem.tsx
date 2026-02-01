import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { GiftHistoryItemProps } from './types';
import { styles } from './styles';

const GiftHistoryItem: React.FC<GiftHistoryItemProps> = ({
  item,
  onPress,
  style,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(item);
    }
  };

  const getIconName = () => {
    if (item.icon === 'shield') return 'shield';
    if (item.icon === 'heart') return 'favorite';
    return 'card-giftcard';
  };

  const statusColor = item.type === 'sent' ? '#DC3545' : '#007BFF';
  const statusText = item.type === 'sent' ? 'Sent' : 'Received';
  const displayText = item.type === 'sent' 
    ? `To ${item.recipient}` 
    : `From ${item.sender}`;

  const content = (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[styles.container, style]}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Icon name={getIconName()} size={20} color={colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.recipientText}>{displayText}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>
    </TouchableOpacity>
  );

  return content;
};

export default GiftHistoryItem;
