import { apiRequest, unwrapData } from './http';

export type UpcomingOccasion = {
  id: string;
  kind: 'friend_birthday' | 'event_occasion';
  title: string;
  type: string;
  date: string;
  daysUntil: number;
  friendId?: string;
  friendName?: string;
  friendAvatar?: string | null;
  eventId?: string;
  createdByName?: string | null;
  isOwn?: boolean;
};

export async function getUpcomingOccasionsApi(withinDays = 30): Promise<UpcomingOccasion[]> {
  const response = await apiRequest<unknown>(
    `/occasions/upcoming?withinDays=${encodeURIComponent(String(withinDays))}`,
    { auth: true },
  );
  const data = unwrapData<UpcomingOccasion[] | UpcomingOccasion>(response);
  return Array.isArray(data) ? data : data ? [data] : [];
}
