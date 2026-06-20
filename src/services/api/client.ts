const DEFAULT_API_URL = 'http://localhost:5000/api/v1';
const API_REQUEST_TIMEOUT_MS = 8000;

export const getApiBaseUrl = (): string =>
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || DEFAULT_API_URL;

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
}

export const apiRequest = async <TData>(path: string, options: ApiRequestOptions = {}): Promise<TData> => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      method: options.method || 'GET',
      headers: {
        Accept: 'application/json',
        ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    return await response.json() as TData;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

export const apiGet = async <TData>(path: string, headers: Record<string, string> = {}): Promise<TData> =>
  apiRequest<TData>(path, { method: 'GET', headers });

export const apiPost = async <TData>(
  path: string,
  body: unknown,
  headers: Record<string, string> = {},
): Promise<TData> => apiRequest<TData>(path, { method: 'POST', body, headers });

export const apiDelete = async <TData>(path: string, headers: Record<string, string> = {}): Promise<TData> =>
  apiRequest<TData>(path, { method: 'DELETE', headers });

export const apiPatch = async <TData>(
  path: string,
  body: unknown,
  headers: Record<string, string> = {},
): Promise<TData> => apiRequest<TData>(path, { method: 'PATCH', body, headers });
