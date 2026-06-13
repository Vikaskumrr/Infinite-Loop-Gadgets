import { apiGet, getApiBaseUrl } from '../services/api/client';
import type { AuthSession, AuthUser } from './types';

interface ApiSuccessResponse<TData> {
  success: true;
  data: TData;
  message: string;
}

const postAuth = async <TData>(path: string, body: unknown): Promise<TData> => {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json() as ApiSuccessResponse<TData> | { success: false; message: string };
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Authentication request failed.');
  }

  return payload.data;
};

export const authService = {
  register: (input: { name: string; email: string; password: string }): Promise<AuthSession> =>
    postAuth<AuthSession>('/auth/register', input),

  login: (input: { email: string; password: string }): Promise<AuthSession> =>
    postAuth<AuthSession>('/auth/login', input),

  me: async (token: string): Promise<AuthUser> => {
    const response = await apiGet<ApiSuccessResponse<{ user: AuthUser }>>('/auth/me', {
      Authorization: `Bearer ${token}`,
    });
    return response.data.user;
  },
};
