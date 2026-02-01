import type { WishlistDetailItemData } from '../../../components/WishlistDetailItem';

export type WishlistDetailStackParams = {
  WishlistDetail: { wishlistName?: string };
};

export const DUMMY_WISHLIST_ITEMS: WishlistDetailItemData[] = [
  {
    id: '1',
    title: 'Designer Smartwatch Series 7',
    price: 'PKR 85,000',
    image: 'https://picsum.photos/seed/watch/400/200',
    statusText: '150 of 300 gifted',
  },
  {
    id: '2',
    title: 'Premium Noise-Cancelling',
    price: 'PKR 52,000',
    image: 'https://picsum.photos/seed/headphones/400/200',
    statusText: 'Contribution Not Enabled',
    tag: 'Available',
  },
  {
    id: '3',
    title: 'Custom Engraved Silver Necklace',
    price: 'PKR 24,000',
    image: 'https://picsum.photos/seed/necklace/400/200',
    statusText: 'Contribution Enabled',
    tag: 'Gifted',
  },
  {
    id: '4',
    title: 'High-Performance Coffee Maker',
    price: 'PKR 34,000',
    image: 'https://picsum.photos/seed/coffee/400/200',
    statusText: 'Contribution Enabled',
    tag: 'Available',
    categoryValue: 'kitchen_appliances',
  },
];
