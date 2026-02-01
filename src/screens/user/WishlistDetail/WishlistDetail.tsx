import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WishlistDetailItem } from '../../../components';
import type { WishlistDetailItemData } from '../../../components/WishlistDetailItem';
import { DUMMY_WISHLIST_ITEMS } from './types';
import { styles } from './styles';

type WishlistDetailRouteProp = RouteProp<
  { params: { wishlistName?: string } },
  'params'
>;

type EventsStackParamList = {
  WishlistDetail: { wishlistName?: string };
  EditItem: { item: WishlistDetailItemData; categoryValue?: string | number };
};

const WishlistDetail = () => {
  const route = useRoute<WishlistDetailRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<EventsStackParamList, 'WishlistDetail'>>();
  const wishlistName = route.params?.wishlistName ?? 'Birthday Wishlist';
  const items = DUMMY_WISHLIST_ITEMS;

  const renderItem = ({ item }: { item: WishlistDetailItemData }) => (
    <WishlistDetailItem
      item={item}
      onViewDetails={(i) => {
        // TODO: Navigate to item detail when implemented
      }}
      onEdit={(i) => navigation.navigate('EditItem', { item: i })}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>
            Wishlist Items ({items.length})
          </Text>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default WishlistDetail;
