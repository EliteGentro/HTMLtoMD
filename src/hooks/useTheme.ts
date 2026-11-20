import { useState, useEffect, useCallback } from 'react';
import type { Theme } from '../types';
import { readStorage, writeStorage } from '../libs/storage';

// Keep in sync with the inline script in index.html
export const THEME_STORAGE_KEY = 'htmltomd:theme';

const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

/**
 * Follows the system color scheme until the user picks a theme explicitly;
 * the explicit choice is persisted and wins from then on.
 */
export function useTheme() {
  const [override, setOverride] = useState<Theme | null>(() =>
    readStorage<Theme | null>(THEME_STORAGE_KEY, null)
  );
  const [systemTheme, setSystemTheme] = useState<Theme>(() =>
    darkQuery().matches ? 'dark' : 'light'
  );

  useEffect(() => {
    const mq = darkQuery();
    const onChange = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const theme = override ?? systemTheme;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    // Choosing the system theme again clears the override so OS changes are followed
    const nextOverride = next === systemTheme ? null : next;
    setOverride(nextOverride);
    writeStorage(THEME_STORAGE_KEY, nextOverride);
  }, [theme, systemTheme]);

  return { theme, toggleTheme };
}
