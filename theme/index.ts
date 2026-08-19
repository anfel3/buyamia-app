import { Platform } from 'react-native';

export const colors = {
  app: '#FAF8F4',
  appAlt: '#EFEEDE',
  border: 'rgba(65,62,60,0.14)',
  charcoal: '#413E3C',
  dark: '#1E1C1A',
  exterior: '#202020',
  ink: '#1E1C1A',
  lime: '#D9FF40',
  limeDark: '#5B6E2C',
  muted: '#9B9A99',
  paper: '#FFFFFF',
  sand: '#E7E5D5',
  white: '#FFFFFF',
  danger: '#B24747',
} as const;

export const spacing = {
  xs: 4,
  sm: 7,
  md: 10,
  lg: 14,
  xl: 20,
  xxl: 30,
} as const;

export const radii = {
  xs: 3,
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
} as const;

const sans = Platform.select({
  ios: 'Helvetica Neue',
  android: 'sans-serif',
  default: 'Arial',
});

const serif = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

export const typography = {
  brand: {
    fontFamily: sans,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 20,
  },
  body: {
    fontFamily: sans,
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 15,
  },
  button: {
    fontFamily: sans,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 13,
  },
  caption: {
    fontFamily: sans,
    fontSize: 8,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 11,
  },
  display: {
    fontFamily: serif,
    fontSize: 31,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 32,
  },
  h1: {
    fontFamily: serif,
    fontSize: 25,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 27,
  },
  h2: {
    fontFamily: serif,
    fontSize: 21,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 23,
  },
  h3: {
    fontFamily: serif,
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 20,
  },
} as const;

export const shadows = {
  card: Platform.select({
    web: {
      boxShadow: '0 10px 24px rgba(35, 34, 28, 0.14)',
    },
    default: {
      elevation: 2,
      shadowColor: '#000000',
      shadowOpacity: 0.12,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 5 },
    },
  }),
} as const;

export const layout = {
  phoneMaxWidth: 430,
} as const;

export const theme = {
  colors,
  layout,
  radii,
  shadows,
  spacing,
  typography,
} as const;

export type Theme = typeof theme;
