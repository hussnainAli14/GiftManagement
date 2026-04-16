import { apiRequest, unwrapData } from './http';
import { API_BASE_URL } from './config';
import { tokenStorage } from './storage';

export type UserProfile = {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: string;
  birthdate?: string;
  gender?: string;
  interests?: string[];
  notificationsEnabled?: boolean;
};

export async function getMyProfileApi(): Promise<UserProfile> {
  const response = await apiRequest<unknown>('/users/profile', { auth: true });
  return unwrapData<UserProfile>(response);
}

export async function updateMyProfileApi(payload: Partial<UserProfile>): Promise<UserProfile> {
  const response = await apiRequest<unknown>('/users/profile', {
    method: 'PUT',
    auth: true,
    body: payload,
  });
  return unwrapData<UserProfile>(response);
}

export async function registerDeviceTokenApi(token: string): Promise<void> {
  await apiRequest('/users/device-token', { method: 'POST', auth: true, body: { token } });
}

export async function removeDeviceTokenApi(token: string): Promise<void> {
  await apiRequest('/users/device-token', { method: 'DELETE', auth: true, body: { token } });
}

export async function changePasswordApi(currentPassword: string, newPassword: string): Promise<void> {
  await apiRequest('/users/change-password', {
    method: 'POST',
    auth: true,
    body: { currentPassword, newPassword },
  });
}

export async function uploadMyAvatarApi(fileUri: string): Promise<string> {
  const token = tokenStorage.getToken();
  if (!token) throw new Error('Not authenticated');

  const form = new FormData();
  form.append('avatar', {
    uri: fileUri,
    type: 'image/jpeg',
    name: 'avatar.jpg',
  } as any);

  const res = await fetch(`${API_BASE_URL}/users/avatar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await res.json() : null;
  if (!res.ok) {
    const msg = payload?.message || payload?.error || `Upload failed with ${res.status}`;
    throw new Error(msg);
  }

  const avatar = payload?.data?.avatar;
  if (typeof avatar !== 'string' || !avatar) throw new Error('Upload failed: no avatar returned');
  return avatar;
}

/** GET /users/search — each user may include `friendshipStatus` from the server. */
export type UserSearchResult = UserProfile & {
  friendshipStatus?: 'available' | 'friend' | 'pending';
};

export async function searchUsersApi(query: string): Promise<UserSearchResult[]> {
  const response = await apiRequest<unknown>(`/users/search?q=${encodeURIComponent(query)}`, { auth: true });
  const data = unwrapData<UserSearchResult[] | UserSearchResult>(response);
  return Array.isArray(data) ? data : [data];
}

export async function getAllUsersAdminApi(): Promise<UserProfile[]> {
  const response = await apiRequest<unknown>('/users/admin/all', { auth: true });
  const data = unwrapData<UserProfile[] | UserProfile>(response);
  return Array.isArray(data) ? data : [data];
}

export async function getAdminsApi(): Promise<UserProfile[]> {
  const response = await apiRequest<unknown>('/users/admins', { auth: true });
  const data = unwrapData<UserProfile[] | UserProfile>(response);
  return Array.isArray(data) ? data : [data];
}

/** Public user document (password excluded). */
export async function getUserByIdApi(id: string): Promise<UserProfile> {
  return apiRequest<UserProfile>(`/users/${id}`, { auth: true });
}
