import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Container } from '../Container';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { EventCardProps } from './types';
import { styles } from './styles';

const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  style,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(event);
    }
  };

  const content = (
    <Container style={[styles.eventCard, style]}>
      <View style={styles.eventContent}>
        <View style={styles.eventRow}>
          <Icon name="event" size={20} color={colors.darkGray} />
          <Text style={styles.eventDate}>{event.dateTime}</Text>
        </View>
        <Text style={styles.eventName}>{event.name}</Text>
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

export default EventCard;
