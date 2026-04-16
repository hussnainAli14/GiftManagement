import { API_BASE_URL } from './config';
import { tokenStorage } from './storage';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  auth?: boolean;
};

function buildHeaders(auth: boolean): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = tokenStorage.getToken();
  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function extractMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') {
    return fallback;
  }

  const maybeMessage = (payload as { message?: string; error?: string }).message
    ?? (payload as { message?: string; error?: string }).error;
  return maybeMessage || fallback;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = false } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(auth),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(extractMessage(payload, `Request failed with ${response.status}`));
  }

  return payload as T;
}

export function unwrapData<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}
