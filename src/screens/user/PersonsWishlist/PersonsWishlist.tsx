import React from 'react';
import { View, FlatList } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PersonsWishlistItem } from '../../../components';
import type { PersonsWishlistItemData } from '../../../components/PersonsWishlistItem';
import { DUMMY_PERSONS_WISHLIST_ITEMS, type PersonsWishlistParams } from './types';
import { styles } from './styles';

type PersonsWishlistRouteProp = RouteProp<
  { params: PersonsWishlistParams },
  'params'
>;

type PersonsWishlistStackParamList = {
  PersonsWishlist: PersonsWishlistParams;
  GiftOptions: { item: PersonsWishlistItemData; eventTitle?: string };
};

const PersonsWishlist = () => {
  const route = useRoute<PersonsWishlistRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<PersonsWishlistStackParamList, 'PersonsWishlist'>>();
  const eventTitle = route.params?.eventTitle;
  const items = DUMMY_PERSONS_WISHLIST_ITEMS;

  const handleItemPress = (item: PersonsWishlistItemData) => {
    navigation.navigate('GiftOptions', { item, eventTitle });
  };

  const renderItem = ({ item }: { item: PersonsWishlistItemData }) => (
    <PersonsWishlistItem item={item} onPress={handleItemPress} />
  );

  return (
    <View style={styles.container}>
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
