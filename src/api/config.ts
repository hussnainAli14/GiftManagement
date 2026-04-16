import { Platform } from 'react-native';

// Keep this as the single source of truth for backend URL.
// Android emulator uses 10.0.2.2 to reach host machine.
const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

/** Server origin (no `/api`) — use for static assets e.g. `/uploads/...` avatar paths. */
export const API_ORIGIN = `http://${host}:5000`;

export const API_BASE_URL = `${API_ORIGIN}/api`;
