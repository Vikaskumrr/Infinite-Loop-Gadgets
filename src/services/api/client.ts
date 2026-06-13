const DEFAULT_API_URL = 'http://localhost:5000/api/v1';
const API_REQUEST_TIMEOUT_MS = 8000;

export const getApiBaseUrl = (): string =>
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || DEFAULT_API_URL;

export const apiGet = async <TData>(path: string): Promise<TData> => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      headers: {
        Accept: 'application/json',
      },
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
