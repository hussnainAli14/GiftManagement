import type { PersonsWishlistItemData } from '../../../components/PersonsWishlistItem';

export type PersonsWishlistParams = {
  eventTitle?: string;
};

export const DUMMY_PERSONS_WISHLIST_ITEMS: PersonsWishlistItemData[] = [
  {
    id: '1',
    title: 'Next-Gen Gaming Console',
    description:
      'High-performance console for immersive gaming with advanced graphics and fast load times.',
    price: 'PKR 138,000',
    image: 'https://picsum.photos/seed/console/400/200',
    contributedPercent: 60,
  },
  {
    id: '2',
    title: 'Advanced Smartwatch',
    description:
      'Track fitness, receive notifications, and make calls from your wrist.',
    price: 'PKR 69,000',
    image: 'https://picsum.photos/seed/smartwatch/400/200',
    contributedPercent: 30,
  },
  {
    id: '3',
    title: 'Premium Espresso Machine',
    description:
      'Craft perfect barista-quality coffee at home with ease and consistency.',
    price: 'PKR 91,000',
    image: 'https://picsum.photos/seed/espresso/400/200',
    contributedPercent: 90,
    category: 'Home & Kitchen',
  },
  {
    id: '4',
    title: 'Professional Camera Drone',
    description:
      'Capture stunning aerial footage with advanced stabilization and 4K recording.',
    price: 'PKR 165,000',
    image: 'https://picsum.photos/seed/drone/400/200',
    contributedPercent: 45,
  },
  {
    id: '5',
    title: 'Noise-Cancelling Headphones',
    description:
      'Immersive audio experience with superior comfort and long-lasting battery.',
    price: 'PKR 45,000',
    image: 'https://picsum.photos/seed/headphones/400/200',
    contributedPercent: 75,
  },
];

export const DUMMY_NON_WISHLIST_ITEMS: PersonsWishlistItemData[] = [
  {
    id: 'n1',
    title: 'Wireless Bluetooth Speaker',
    description:
      'Portable speaker with 360° sound and waterproof design for outdoor use.',
    price: 'PKR 12,000',
    image: 'https://picsum.photos/seed/speaker/400/200',
    contributedPercent: 0,
  },
  {
    id: 'n2',
    title: 'Leather Wallet',
    description:
      'Handcrafted genuine leather wallet with RFID blocking technology.',
    price: 'PKR 8,500',
    image: 'https://picsum.photos/seed/wallet/400/200',
    contributedPercent: 0,
  },
  {
    id: 'n3',
    title: 'Aromatherapy Diffuser',
    description:
      'Ultrasonic essential oil diffuser with LED mood lighting.',
    price: 'PKR 6,200',
    image: 'https://picsum.photos/seed/diffuser/400/200',
    contributedPercent: 0,
  },
  {
    id: 'n4',
    title: 'Fitness Tracker Band',
    description:
      'Lightweight activity tracker with heart rate and sleep monitoring.',
    price: 'PKR 4,500',
    image: 'https://picsum.photos/seed/fitness/400/200',
    contributedPercent: 0,
  },
];
