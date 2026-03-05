// Apple Stocks Dark Mode - Design System
// Mirrors iOS Human Interface Guidelines

export const colors = {
  // Backgrounds
  background: '#000000',
  cardBackground: '#1C1C1E',
  cardBackgroundElevated: '#2C2C2E',
  sheetBackground: '#1C1C1E',
  separator: '#38383A',
  separatorLight: '#2C2C2E',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#636366',

  // Stock Colors
  stockRed: '#FF3B30',
  stockGreen: '#34C759',
  stockRedDim: 'rgba(255, 59, 48, 0.15)',
  stockGreenDim: 'rgba(52, 199, 89, 0.15)',

  // System
  systemBlue: '#0A84FF',
  systemIndigo: '#5E5CE6',
  systemPurple: '#BF5AF2',
  systemTeal: '#64D2FF',
  
  // AI accent
  aiGlow: '#A78BFA',
  aiGlowDim: 'rgba(167, 139, 250, 0.15)',
  aiGold: '#FFD60A',

  // Chart
  chartRedGradientStart: 'rgba(255, 59, 48, 0.4)',
  chartRedGradientEnd: 'rgba(255, 59, 48, 0.0)',
  chartGreenGradientStart: 'rgba(52, 199, 89, 0.4)',
  chartGreenGradientEnd: 'rgba(52, 199, 89, 0.0)',
};

export const typography = {
  // Apple uses SF Pro which maps to System font on iOS
  // On Android, falls back to Roboto
  largeTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.37,
  },
  title1: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.36,
  },
  title2: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.35,
  },
  title3: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.38,
  },
  headline: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
  body: {
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: -0.41,
  },
  callout: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: -0.32,
  },
  subheadline: {
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: -0.24,
  },
  footnote: {
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: -0.08,
  },
  caption1: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
  },
  caption2: {
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 0.07,
  },
  // Large price display
  priceHero: {
    fontSize: 38,
    fontWeight: '700',
    letterSpacing: 0.37,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 999,
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  sheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};
