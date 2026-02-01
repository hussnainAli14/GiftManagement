import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Container } from '../Container';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { HorizontalEventCardProps } from './types';
import { styles } from './styles';

const HorizontalEventCard: React.FC<HorizontalEventCardProps> = ({
  event,
  onPress,
  style,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(event);
    }
  };

  const imageSource =
    typeof event.image === 'string'
      ? { uri: event.image }
      : event.image;

  const content = (
    <Container style={[styles.container, style]} padding={0}>
      <Image source={imageSource} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
        <View style={styles.dateRow}>
          <Icon name="event" size={16} color={colors.darkGray} />
          <Text style={styles.date}>{event.date}</Text>
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

export default HorizontalEventCard;
