export const typography = {
  // Font Family
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    light: 'Inter-Light',
    extraLight: 'Inter-ExtraLight',
    thin: 'Inter-Thin',
    extraBold: 'Inter-ExtraBold',
    black: 'Inter-Black',
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Font Weights
  fontWeight: {
    thin: '100',
    extraLight: '200',
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
    black: '900',
  },
  
  // Text Styles
  textStyles: {
    h1: {
      fontFamily: 'Inter-Bold',
      fontSize: 36,
      lineHeight: 43.2,
      fontWeight: '700' as const,
    },
    h2: {
      fontFamily: 'Inter-Bold',
      fontSize: 30,
      lineHeight: 36,
      fontWeight: '700' as const,
    },
    h3: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 24,
      lineHeight: 28.8,
      fontWeight: '600' as const,
    },
    h4: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 20,
      lineHeight: 24,
      fontWeight: '600' as const,
    },
    h5: {
      fontFamily: 'Inter-Medium',
      fontSize: 18,
      lineHeight: 21.6,
      fontWeight: '500' as const,
    },
    h6: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      lineHeight: 19.2,
      fontWeight: '500' as const,
    },
    body: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
    },
    bodySmall: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '400' as const,
    },
    caption: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      lineHeight: 18,
      fontWeight: '400' as const,
    },
    button: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600' as const,
    },
    label: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500' as const,
    },
  },
};

export type Typography = typeof typography;
