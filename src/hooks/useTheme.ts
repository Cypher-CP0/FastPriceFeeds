import { useState, useEffect } from 'react';
import { ThemeMode, ThemeConfig, CustomTheme } from '../types/theme';

const defaultCustomTheme: CustomTheme = {
  background: '#ffffff',
  text: '#1f2937',
  primary: '#2563eb',
  secondary: '#64748b',
  accent: '#3b82f6',
};

const getInitialTheme = (): ThemeConfig => {
  const saved = localStorage.getItem('theme-config');
  return saved ? JSON.parse(saved) : { mode: 'light' as ThemeMode };
};

export const useTheme = () => {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(getInitialTheme);

  const updateTheme = (config: ThemeConfig) => {
    setThemeConfig(config);
    localStorage.setItem('theme-config', JSON.stringify(config));
  };

  useEffect(() => {
    const root = document.documentElement;
    const theme = themeConfig.mode === 'custom' ? themeConfig.custom || defaultCustomTheme : null;

    if (themeConfig.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    if (theme) {
      root.style.setProperty('--color-background', theme.background);
      root.style.setProperty('--color-text', theme.text);
      root.style.setProperty('--color-primary', theme.primary);
      root.style.setProperty('--color-secondary', theme.secondary);
      root.style.setProperty('--color-accent', theme.accent);
    } else {
      root.style.removeProperty('--color-background');
      root.style.removeProperty('--color-text');
      root.style.removeProperty('--color-primary');
      root.style.removeProperty('--color-secondary');
      root.style.removeProperty('--color-accent');
    }
  }, [themeConfig]);

  return { themeConfig, updateTheme };
};