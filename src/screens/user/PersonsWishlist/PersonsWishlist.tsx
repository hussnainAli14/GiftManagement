import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PersonsWishlistItem } from '../../../components';
import type { PersonsWishlistItemData } from '../../../components/PersonsWishlistItem';
import {
  DUMMY_PERSONS_WISHLIST_ITEMS,
  DUMMY_NON_WISHLIST_ITEMS,
  type PersonsWishlistParams,
} from './types';
import { styles } from './styles';

type PersonsWishlistRouteProp = RouteProp<
  { params: PersonsWishlistParams },
  'params'
>;

type PersonsWishlistStackParamList = {
  PersonsWishlist: PersonsWishlistParams;
  GiftOptions: { item: PersonsWishlistItemData; eventTitle?: string };
};

type TabType = 'wishlist' | 'nonWishlist';

const PersonsWishlist = () => {
  const route = useRoute<PersonsWishlistRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<PersonsWishlistStackParamList, 'PersonsWishlist'>>();
  const eventTitle = route.params?.eventTitle;
  const [activeTab, setActiveTab] = useState<TabType>('wishlist');

  const wishlistItems = DUMMY_PERSONS_WISHLIST_ITEMS;
  const nonWishlistItems = DUMMY_NON_WISHLIST_ITEMS;
  const items = activeTab === 'wishlist' ? wishlistItems : nonWishlistItems;

  const handleItemPress = (item: PersonsWishlistItemData) => {
    if (activeTab === 'wishlist') {
      navigation.navigate('GiftOptions', { item, eventTitle });
    }
  };

  const renderItem = ({ item }: { item: PersonsWishlistItemData }) => (
    <PersonsWishlistItem
      item={item}
      onPress={activeTab === 'wishlist' ? handleItemPress : undefined}
      showContributed={activeTab === 'wishlist'}
    />
  );

  const renderTab = (tab: TabType, label: string) => {
    const isSelected = activeTab === tab;
    return (
      <TouchableOpacity
        key={tab}
        style={[styles.tab, isSelected && styles.tabSelected]}
        onPress={() => setActiveTab(tab)}
      >
        <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        {renderTab('wishlist', 'Wishlist')}
        {renderTab('nonWishlist', 'Non Wishlist')}
      </View>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default PersonsWishlist;
