import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Container } from '../Container';
import { ProgressBar } from '../ProgressBar';
import { PersonsWishlistItemProps } from './types';
import { styles } from './styles';

const PersonsWishlistItem: React.FC<PersonsWishlistItemProps> = ({
  item,
  onPress,
  showContributed = true,
  style,
}) => {
  const imageSource =
    typeof item.image === 'string' ? { uri: item.image } : item.image;

  const content = (
    <Container style={StyleSheet.flatten([styles.container, style])}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.price}>{item.price}</Text>
        {showContributed && (
          <View style={styles.progressWrapper}>
            <ProgressBar
              progress={item.contributedPercent}
              label={`${item.contributedPercent}% contributed`}
            />
          </View>
        )}
      </View>
    </Container>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default PersonsWishlistItem;
