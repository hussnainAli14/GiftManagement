import { apiRequest, unwrapData } from './http';

export type MessageDto = {
  _id: string;
  conversationKey: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  text: string;
  read: boolean;
  createdAt: string;
};

export type ConversationSummary = {
  peerUser: { _id: string; name: string; avatar?: string };
  lastMessage: MessageDto | null;
  unreadCount: number;
};

export async function getConversationsApi(): Promise<ConversationSummary[]> {
  const res = await apiRequest<unknown>('/messages/conversations', { auth: true });
  return unwrapData<ConversationSummary[]>(res);
}

export async function getMessagesWithPeerApi(peerUserId: string, before?: string): Promise<MessageDto[]> {
  const q = before ? `?before=${encodeURIComponent(before)}` : '';
  const res = await apiRequest<unknown>(`/messages/with/${peerUserId}${q}`, { auth: true });
  return unwrapData<MessageDto[]>(res);
}

export async function postMessageApi(peerUserId: string, text: string): Promise<MessageDto> {
  const res = await apiRequest<unknown>(`/messages/with/${peerUserId}`, {
    method: 'POST',
    auth: true,
    body: { text },
  });
  return unwrapData<MessageDto>(res);
}

export async function markMessagesReadApi(peerUserId: string): Promise<void> {
  await apiRequest(`/messages/with/${peerUserId}/read`, { method: 'POST', auth: true });
}
