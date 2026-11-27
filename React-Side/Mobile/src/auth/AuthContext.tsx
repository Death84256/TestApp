import Constants from 'expo-constants';
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';

export type Account = { userId: string; name: string };

type AuthContextValue = {
  user: Account | null;
  token: string | null;
  login: (userId: string, password: string) => Promise<void>;
  register: (userId: string, name: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getApiBaseUrl() {
  const override = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (override) return override.replace(/\/$/, '');

  const hostUri = Constants.expoConfig?.hostUri;
  const hostAddress = hostUri?.replace(/^https?:\/\//, '').split('/')[0];
  const host = hostAddress ? new URL(`http://${hostAddress}`).hostname.replace(/^\[|\]$/g, '') : null;
  if (host) return `http://${host}:3001`;

  if (Platform.OS === 'web') return 'http://localhost:3001';
  return '';
}

export const API_BASE_URL = getApiBaseUrl();

async function request<T>(path: string, body?: object, token?: string): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('Cannot detect the Expo development server address. Set EXPO_PUBLIC_API_URL to your PC LAN address.');
  }
  let response: Response;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    response = await fetch(`${API_BASE_URL}/api/account/${path}`, {
      method: body ? 'POST' : 'GET',
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: controller.signal,
    });
  } catch {
    throw new Error(`Cannot reach the Express API gateway at ${API_BASE_URL}. Check that the gateway and C# backend are running and your phone is on the same Wi-Fi.`);
  } finally {
    clearTimeout(timeout);
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message ?? `Request failed (${response.status}).`);
  }
  return data as T;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Account | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    async login(userId, password) {
      const result = await request<{ user: Account; accessToken: string }>('login', { userId, password });
      setUser(result.user);
      setToken(result.accessToken);
    },
    async register(userId, name, password, confirmPassword) {
      await request('register', { userId, name, password, confirmPassword });
    },
    async logout() {
      if (token) await request('logout', {}, token).catch(() => undefined);
      setUser(null);
      setToken(null);
    },
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
