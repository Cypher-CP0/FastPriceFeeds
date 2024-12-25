export type ThemeMode = 'light' | 'dark' | 'custom';

export interface CustomTheme {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
}

export interface ThemeConfig {
  mode: ThemeMode;
  custom?: CustomTheme;
}