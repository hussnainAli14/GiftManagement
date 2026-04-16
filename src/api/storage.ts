import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@GiftManagement/auth_token';
const USER_KEY = '@GiftManagement/auth_user';

/** Shape persisted as JSON next to the access token. */
export type StoredAuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  isApproved?: boolean;
};

let accessToken: string | null = null;

export const tokenStorage = {
  /** In-memory token for synchronous `Authorization` headers (set after restore or login). */
  getToken(): string | null {
    return accessToken;
  },

  async persistSession(token: string, user: StoredAuthUser): Promise<void> {
    accessToken = token;
    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [USER_KEY, JSON.stringify(user)],
    ]);
  },

  async clearSession(): Promise<void> {
    accessToken = null;
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  },

  /**
   * Loads token into memory for `apiRequest` and returns the user for auth state.
   * Clears storage if data is missing or invalid.
   */
  async restoreSession(): Promise<{ token: string; user: StoredAuthUser } | null> {
    try {
      const [[, token], [, raw]] = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
      if (!token || !raw) {
        accessToken = null;
        return null;
      }
      const user = JSON.parse(raw) as StoredAuthUser;
      if (!user?.id || typeof user.email !== 'string') {
        await tokenStorage.clearSession();
        return null;
      }
      accessToken = token;
      return { token, user };
    } catch {
      await tokenStorage.clearSession();
      return null;
    }
  },
};
