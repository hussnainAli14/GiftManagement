import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Container } from '../Container';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { EventListItemProps, EventStatus } from './types';
import { styles } from './styles';

const STATUS_LABELS: Record<EventStatus, string> = {
  upcoming: 'Upcoming',
  past: 'Past',
  draft: 'Draft',
};

const STATUS_BG_COLOR = '#17A2B8'; // cyan/teal

const EventListItem: React.FC<EventListItemProps> = ({
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
    <Container style={[styles.container, style]}>
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        <View style={styles.dateRow}>
          <Icon name="event" size={18} color={colors.darkGray} />
          <Text style={styles.date}>{event.date}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {STATUS_LABELS[event.status]}
          </Text>
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

export default EventListItem;
