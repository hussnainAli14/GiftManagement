import type { PersonsWishlistItemData } from '../../../components/PersonsWishlistItem';

export interface ContributionProgressParams {
  item: PersonsWishlistItemData;
  eventTitle?: string;
}

export interface ContributorEntry {
  id: string;
  name: string;
  date: string;
  amount: string;
  status: 'Confirmed';
}

export const DUMMY_CONTRIBUTORS: ContributorEntry[] = [
  { id: '1', name: 'Sara', date: '2026-10-26', amount: 'PKR 100.00', status: 'Confirmed' },
  { id: '2', name: 'Saifullah', date: '2026-10-25', amount: 'PKR 75.00', status: 'Confirmed' },
  { id: '3', name: 'Daniyal', date: '2026-10-24', amount: 'PKR 50.00', status: 'Confirmed' },
  { id: '4', name: 'Zain', date: '2026-10-23', amount: 'PKR 125.00', status: 'Confirmed' },
];
