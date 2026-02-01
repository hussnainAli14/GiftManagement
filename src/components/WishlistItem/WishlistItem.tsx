import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Container } from '../Container';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { WishlistItemProps } from './types';
import { styles } from './styles';

const WishlistItem: React.FC<WishlistItemProps> = ({
  item,
  onPress,
  style,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(item);
    }
  };

  const imageSource =
    typeof item.image === 'string'
      ? { uri: item.image }
      : item.image;

  const statusColor = item.status === 'Fulfilled' ? '#17A2B8' : colors.primary;

  const content = (
    <Container style={[styles.container, style]} padding={0}>
      <Image source={imageSource} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{item.status}</Text>
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

export default WishlistItem;
