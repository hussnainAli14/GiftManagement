import { apiRequest, unwrapData } from './http';

export type EventModel = {
  _id: string;
  name: string;
  date: string;
  type?: string;
  privacy?: string;
  createdBy?: string | { _id: string; name?: string; email?: string };
};

type EventResponse = {
  success: boolean;
  message?: string;
  data: EventModel | EventModel[];
};

export async function getMyEventsApi(): Promise<EventModel[]> {
  const response = await apiRequest<EventResponse>('/events/mine', { auth: true });
  const data = unwrapData<EventModel[] | EventModel>(response);
  return Array.isArray(data) ? data : [data];
}

/** Events feed: public + friends-only (for friends) + own (including private). */
export async function getEventsFeedApi(): Promise<EventModel[]> {
  const response = await apiRequest<EventResponse>('/events', { auth: true });
  const data = unwrapData<EventModel[] | EventModel>(response);
  return Array.isArray(data) ? data : [data];
}

/** Upcoming events created by this user, visible to the logged-in viewer (privacy + friendship). */
export async function getEventsByUserApi(userId: string): Promise<EventModel[]> {
  const response = await apiRequest<EventResponse>(`/events/by-user/${userId}`, { auth: true });
  const data = unwrapData<EventModel[] | EventModel>(response);
  return Array.isArray(data) ? data : [data];
}

export async function createEventApi(input: {
  name: string;
  date: string;
  type: string;
  privacy?: string;
}): Promise<EventModel> {
  const response = await apiRequest<EventResponse>('/events', {
    method: 'POST',
    auth: true,
    body: input,
  });
  return unwrapData<EventModel>(response);
}

export async function getEventByIdApi(eventId: string): Promise<EventModel> {
  const response = await apiRequest<EventResponse>(`/events/${encodeURIComponent(eventId)}`, {
    auth: true,
  });
  return unwrapData<EventModel>(response);
}

export async function updateEventApi(
  eventId: string,
  input: {
    name?: string;
    date?: string;
    type?: string;
    privacy?: string;
  },
): Promise<EventModel> {
  const response = await apiRequest<EventResponse>(`/events/${encodeURIComponent(eventId)}`, {
    method: 'PUT',
    auth: true,
    body: input,
  });
  return unwrapData<EventModel>(response);
}

export async function deleteEventApi(eventId: string): Promise<void> {
  await apiRequest<EventResponse>(`/events/${encodeURIComponent(eventId)}`, {
    method: 'DELETE',
    auth: true,
  });
}
