/**
 * Font Loading Utility
 * Helps verify and debug font loading in React Native
 */

import { Platform } from 'react-native';

export const FontNames = {
  Inter: {
    Thin: 'Inter-Thin',
    ExtraLight: 'Inter-ExtraLight',
    Light: 'Inter-Light',
    Regular: 'Inter-Regular',
    Medium: 'Inter-Medium',
    SemiBold: 'Inter-SemiBold',
    Bold: 'Inter-Bold',
    ExtraBold: 'Inter-ExtraBold',
    Black: 'Inter-Black',
  },
} as const;

/**
 * Get font family with platform-specific fallback
 * React Native uses the font file name (without extension) as the font family name
 */
export const getFontFamily = (fontName: string): string => {
  // In React Native, font family name = filename without .ttf
  // Example: Inter-Regular.ttf → fontFamily: 'Inter-Regular'
  return fontName;
};

/**
 * Platform-specific font loading info
 */
export const getFontInfo = () => {
  return {
    platform: Platform.OS,
    fontDirectory: Platform.select({
      ios: 'Fonts are loaded from bundle via Info.plist',
      android: 'Fonts are loaded from assets/fonts/ directory',
    }),
    expectedFonts: Object.values(FontNames.Inter),
  };
};

/**
 * Debug: Log font information
 */
export const logFontInfo = () => {
  const info = getFontInfo();
  console.log('Font Loading Info:');
  console.log(`Platform: ${info.platform}`);
  console.log(`Font Directory: ${info.fontDirectory}`);
  console.log('Expected Fonts:', info.expectedFonts);
};
