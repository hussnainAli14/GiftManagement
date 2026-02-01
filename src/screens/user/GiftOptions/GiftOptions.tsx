import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../../components';
import type { PersonsWishlistItemData } from '../../../components/PersonsWishlistItem';
import { colors, typography } from '../../../theme';

type GiftOptionsParams = {
  item: PersonsWishlistItemData;
  eventTitle?: string;
};

type GiftOptionsRouteProp = RouteProp<
  { params: GiftOptionsParams },
  'params'
>;

type GiftingMethod = 'full' | 'contribute';

type GiftOptionsStackParamList = {
  GiftOptions: GiftOptionsParams;
  SelectVendor: { item: PersonsWishlistItemData; eventTitle?: string };
  ContributionProgress: { item: PersonsWishlistItemData; eventTitle?: string };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  productCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGray,
    marginBottom: 24,
    gap: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
  },
  productContent: {
    flex: 1,
    minWidth: 0,
  },
  productTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold as '700',
    color: colors.black,
    marginBottom: 4,
  },
  productPrice: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold as '700',
    color: colors.primary,
    marginBottom: 4,
  },
  productMeta: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.darkGray,
    marginBottom: 2,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold as '700',
    color: colors.black,
    marginBottom: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    gap: 12,
  },
  optionCardSelected: {
    borderColor: colors.primary,
  },
  optionCardUnselected: {
    backgroundColor: colors.white,
    borderColor: colors.borderGray,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  radioOuterUnselected: {
    borderColor: colors.darkGray,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  optionIcon: {
    marginRight: 0,
  },
  optionText: {
    flex: 1,
    minWidth: 0,
  },
  optionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold as '700',
    color: colors.black,
    marginBottom: 4,
  },
  optionDescription: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.darkGray,
  },
  confirmButton: {
    marginTop: 24,
  },
});

const GiftOptions = () => {
  const route = useRoute<GiftOptionsRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<GiftOptionsStackParamList, 'GiftOptions'>>();
  const { item, eventTitle } = route.params ?? { item: null };
  const [giftingMethod, setGiftingMethod] = useState<GiftingMethod>('full');

  const handleConfirm = () => {
    if (giftingMethod === 'full') {
      navigation.navigate('SelectVendor', { item, eventTitle });
    } else {
      navigation.navigate('ContributionProgress', { item, eventTitle });
    }
  };

  if (!item) {
    return null;
  }

  const imageSource =
    typeof item.image === 'string' ? { uri: item.image } : item.image;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Product card */}
        <View style={styles.productCard}>
          <Image source={imageSource} style={styles.productImage} resizeMode="cover" />
          <View style={styles.productContent}>
            <Text style={styles.productTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.productPrice}>{item.price}</Text>
            {eventTitle ? (
              <Text style={styles.productMeta}>From: {eventTitle}</Text>
            ) : null}
            {item.category ? (
              <Text style={styles.productMeta}>Category: {item.category}</Text>
            ) : null}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Choose Your Gifting Method</Text>

        {/* Full Gift option */}
        <TouchableOpacity
          style={[
            styles.optionCard,
            giftingMethod === 'full' ? styles.optionCardSelected : styles.optionCardUnselected,
          ]}
          onPress={() => setGiftingMethod('full')}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.radioOuter,
              giftingMethod === 'full' ? styles.radioOuterSelected : styles.radioOuterUnselected,
            ]}
          >
            {giftingMethod === 'full' ? <View style={styles.radioInner} /> : null}
          </View>
          <Icon
            name="card-giftcard"
            size={24}
            color={giftingMethod === 'full' ? colors.primary : colors.darkGray}
            style={styles.optionIcon}
          />
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Full Gift</Text>
            <Text style={styles.optionDescription}>
              Purchase the entire item as a gift for the recipient.
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color={colors.darkGray} />
        </TouchableOpacity>

        {/* Contribute option */}
        <TouchableOpacity
          style={[
            styles.optionCard,
            giftingMethod === 'contribute' ? styles.optionCardSelected : styles.optionCardUnselected,
          ]}
          onPress={() => setGiftingMethod('contribute')}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.radioOuter,
              giftingMethod === 'contribute' ? styles.radioOuterSelected : styles.radioOuterUnselected,
            ]}
          >
            {giftingMethod === 'contribute' ? <View style={styles.radioInner} /> : null}
          </View>
          <Icon
            name="volunteer-activism"
            size={24}
            color={giftingMethod === 'contribute' ? colors.primary : colors.darkGray}
            style={styles.optionIcon}
          />
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Contribute</Text>
            <Text style={styles.optionDescription}>
              Contribute a partial amount towards the item.
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color={colors.darkGray} />
        </TouchableOpacity>

        <Button
          variant="primary"
          fullWidth
          onPress={handleConfirm}
          style={styles.confirmButton}
        >
          Confirm Gift Option
        </Button>
      </ScrollView>
    </View>
  );
};

export default GiftOptions;
