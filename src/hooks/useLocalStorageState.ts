import { useEffect, useState } from 'react';
import { readStoredJson, writeStoredJson } from '../utils/storage';

export const useLocalStorageState = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => readStoredJson(key, initialValue));

  useEffect(() => {
    writeStoredJson(key, value);
  }, [key, value]);

  return [value, setValue] as const;
};
