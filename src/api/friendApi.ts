import { apiRequest, unwrapData } from './http';

export type FriendModel = {
  friendshipId?: string;
  friend: {
    _id: string;
    name?: string;
    email?: string;
    avatar?: string;
  };
};

export type FriendRequestModel = {
  _id: string;
  requester?: {
    _id: string;
    name?: string;
    email?: string;
    avatar?: string;
  };
  receiver?: {
    _id: string;
    name?: string;
    email?: string;
    avatar?: string;
  };
  status: string;
};

export async function getFriendsApi(): Promise<FriendModel[]> {
  const response = await apiRequest<unknown>('/friendships', { auth: true });
  const data = unwrapData<FriendModel[] | FriendModel>(response);
  return Array.isArray(data) ? data : [data];
}

export async function getPendingFriendRequestsApi(): Promise<FriendRequestModel[]> {
  const response = await apiRequest<unknown>('/friendships/pending', { auth: true });
  const data = unwrapData<FriendRequestModel[] | FriendRequestModel>(response);
  return Array.isArray(data) ? data : [data];
}

export async function getSentFriendRequestsApi(): Promise<FriendRequestModel[]> {
  const response = await apiRequest<unknown>('/friendships/sent', { auth: true });
  const data = unwrapData<FriendRequestModel[] | FriendRequestModel>(response);
  return Array.isArray(data) ? data : [data];
}

export async function sendFriendRequestApi(receiverId: string): Promise<void> {
  await apiRequest('/friendships/request', {
    method: 'POST',
    auth: true,
    body: { receiverId },
  });
}

export async function acceptFriendRequestApi(requestId: string): Promise<void> {
  await apiRequest('/friendships/accept', {
    method: 'POST',
    auth: true,
    body: { requestId },
  });
}

export async function declineFriendRequestApi(requestId: string): Promise<void> {
  await apiRequest('/friendships/reject', {
    method: 'POST',
    auth: true,
    body: { requestId },
  });
}
