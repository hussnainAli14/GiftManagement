import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Container } from '../Container';
import { Button } from '../Button';
import { Tag } from '../Tag';
import { colors } from '../../theme';
import { WishlistDetailItemProps } from './types';
import { styles } from './styles';

const WishlistDetailItem: React.FC<WishlistDetailItemProps> = ({
  item,
  onViewDetails,
  onEdit,
  style,
}) => {
  const imageSource =
    typeof item.image === 'string' ? { uri: item.image } : item.image;

  return (
    <Container style={[styles.container, style]} padding={0}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.statusText}>{item.statusText}</Text>
        {item.tag ? (
          <View style={styles.tagRow}>
            <Tag backgroundColor={colors.primary} textColor={colors.white}>
              {item.tag}
            </Tag>
          </View>
        ) : null}
        <View style={styles.buttonRow}>
          <Button
            variant="secondary"
            size="small"
            onPress={() => onViewDetails?.(item)}
            style={styles.button}
          >
            View Details
          </Button>
          <Button
            variant="secondary"
            size="small"
            onPress={() => onEdit?.(item)}
            style={styles.button}
          >
            Edit
          </Button>
        </View>
      </View>
    </Container>
  );
};

export default WishlistDetailItem;
