export const palette = {
  blue: '#2563EB',
  purple: '#7C3AED',
  teal: '#14B8A6',
  blueLight: '#60A5FA',
  purpleLight: '#A78BFA',
  tealLight: '#5EEAD4',
  white: '#FFFFFF',
  black: '#0B0F19',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
};

export interface Theme {
  mode: 'light' | 'dark';
  background: string;
  backgroundAlt: string;
  card: string;
  cardAlt: string;
  border: string;
  text: string;
  textMuted: string;
  textFaint: string;
  shadow: string;
  blue: string;
  purple: string;
  teal: string;
  blueLight: string;
  purpleLight: string;
  tealLight: string;
  white: string;
  black: string;
  success: string;
  warning: string;
  danger: string;
  gradientPrimary: readonly [string, string];
  gradientAccent: readonly [string, string];
  gradientTeal: readonly [string, string];
}

export const lightTheme: Theme = {
  mode: 'light',
  background: '#F5F7FB',
  backgroundAlt: '#EEF2FA',
  card: '#FFFFFF',
  cardAlt: '#F8FAFF',
  border: '#E7EAF3',
  text: '#0F172A',
  textMuted: '#64748B',
  textFaint: '#94A3B8',
  shadow: 'rgba(30, 41, 59, 0.08)',
  ...palette,
  gradientPrimary: ['#2563EB', '#7C3AED'],
  gradientAccent: ['#7C3AED', '#14B8A6'],
  gradientTeal: ['#14B8A6', '#2563EB'],
};

export const darkTheme: Theme = {
  mode: 'dark',
  background: '#0B0F19',
  backgroundAlt: '#111827',
  card: '#161C2C',
  cardAlt: '#1B2233',
  border: '#232B3E',
  text: '#F1F5F9',
  textMuted: '#94A3B8',
  textFaint: '#64748B',
  shadow: 'rgba(0, 0, 0, 0.4)',
  ...palette,
  gradientPrimary: ['#3B82F6', '#8B5CF6'],
  gradientAccent: ['#8B5CF6', '#2DD4BF'],
  gradientTeal: ['#2DD4BF', '#3B82F6'],
};
