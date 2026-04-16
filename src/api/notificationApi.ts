import { apiRequest } from './http';

export type BackendNotification = {
  _id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type?: string;
  data?: Record<string, string | undefined> | any;
};

export async function getNotificationsApi(userId: string): Promise<BackendNotification[]> {
  return apiRequest<BackendNotification[]>(`/notifications/user/${userId}`, { auth: true });
}

export async function markNotificationReadApi(notificationId: string): Promise<void> {
  await apiRequest(`/notifications/${notificationId}`, {
    method: 'PUT',
    auth: true,
    body: { read: true },
  });
}

export async function markAllNotificationsReadApi(): Promise<void> {
  await apiRequest('/notifications/read-all', { method: 'POST', auth: true });
}
