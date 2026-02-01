export interface VendorItem {
  id: string;
  name: string;
  address: string;
  distance: string;
  image: string;
}

export const DUMMY_VENDORS: VendorItem[] = [
  {
    id: '1',
    name: 'Gift Emporium',
    address: '23-B, Gulberg III, Lahore',
    distance: '0.5 miles',
    image: 'https://picsum.photos/seed/vendor1/400/200',
  },
  {
    id: '2',
    name: 'Creative Gifting Co.',
    address: 'Plot 10, Block C, Nazimabad, Karachi',
    distance: '1.2 miles',
    image: 'https://picsum.photos/seed/vendor2/400/200',
  },
  {
    id: '3',
    name: 'The Present Palace',
    address: 'Street 7, F-8/3, Islamabad',
    distance: '2.1 miles',
    image: 'https://picsum.photos/seed/vendor3/400/200',
  },
  {
    id: '4',
    name: 'Unique Finds Shop',
    address: 'Commercial Market, Satellite Town, Rawalpindi',
    distance: '3.0 miles',
    image: 'https://picsum.photos/seed/vendor4/400/200',
  },
  {
    id: '5',
    name: 'Celebration Central',
    address: 'Abdali Road, Nawan Shehr, Multan',
    distance: '4.5 miles',
    image: 'https://picsum.photos/seed/vendor5/400/200',
  },
];
