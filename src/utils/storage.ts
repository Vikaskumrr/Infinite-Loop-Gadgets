export const readStoredJson = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const writeStoredJson = <T,>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};
