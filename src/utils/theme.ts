import type { ThemeChoice } from '../types';

export const THEME_STORAGE_KEY = 'theme';
export const DEFAULT_THEME: ThemeChoice = 'gradient';

export const isThemeChoice = (value: string | null): value is ThemeChoice =>
  value === 'gradient' || value === 'neutral' || value === 'dark';

export const applyTheme = (choice: ThemeChoice): void => {
  const classes = document.body.classList;
  classes.remove('theme-gradient', 'theme-neutral', 'theme-dark', 'dark-mode');
  classes.add(`theme-${choice}`);

  if (choice === 'dark') {
    classes.add('dark-mode');
  }
};

export const getStoredTheme = (): ThemeChoice => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeChoice(savedTheme) ? savedTheme : DEFAULT_THEME;
};

export const persistTheme = (choice: ThemeChoice): void => {
  localStorage.setItem(THEME_STORAGE_KEY, choice);
  applyTheme(choice);
};
