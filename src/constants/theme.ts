// Shopa App Theme Constants

export const COLORS = {
  // Primary Colors
  primary: '#2E7D32', // Dark green (main background, matches web)
  primaryLight: '#40A645', // Lighter green for abstract shapes
  primaryDark: '#0D3811', // Darker green for depth

  // Accent Colors
  accent: '#FDC500', // Brand yellow from web logo

  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9E9E9E',
  grayLight: '#E0E0E0',
  grayDark: '#616161',

  // Semantic Colors
  error: '#D32F2F',
  success: '#40A645',

  // Text Colors
  textPrimary: '#212121',
  textSecondary: '#757575',
  textLight: '#FFFFFF',
  textMuted: '#9E9E9E',

  // Background Colors
  backgroundLight: '#FFFFFF',
  backgroundCard: '#FFFFFF',
  mainBg: '#F7FFF8',

  // Input Colors
  inputBorder: '#E0E0E0',
  inputBackground: '#F5F5F5',
  inputPlaceholder: '#9E9E9E',
} as const;

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  italic: 'System',
} as const;

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 32,
  title: 40,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 48,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

export default {
  COLORS,
  FONTS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
};
