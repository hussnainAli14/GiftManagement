import type { ImageSourcePropType } from 'react-native';
import { API_ORIGIN } from '../api/config';

/**
 * Turns a stored user `avatar` string into a loadable URI.
 * Supports absolute http(s), `data:`, `file:`, and server-relative paths (`/uploads/...`).
 */
export function resolveUserAvatarUri(avatar: string | null | undefined): string | undefined {
  if (avatar == null) return undefined;
  const s = String(avatar).trim();
  if (!s) return undefined;

  const lower = s.toLowerCase();
  if (lower.startsWith('http://') || lower.startsWith('https://')) return s;
  if (lower.startsWith('data:') || lower.startsWith('file:')) return s;
  if (s.startsWith('/')) return `${API_ORIGIN}${s}`;

  return s;
}

/**
 * Resolves avatar for <Image source={...} />: backend URL, require(), or initials fallback.
 */
export function getAvatarImageSource(
  avatar: ImageSourcePropType | string | undefined,
  displayName: string,
): ImageSourcePropType {
  if (typeof avatar === 'number') return avatar;
  if (avatar != null && typeof avatar !== 'string') {
    return avatar as ImageSourcePropType;
  }

  const uri = resolveUserAvatarUri(typeof avatar === 'string' ? avatar : undefined);
  if (uri) return { uri };

  const name = (displayName || 'User').trim() || 'User';
  return {
    uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=fce4ec&color=880e4f`,
  };
}
