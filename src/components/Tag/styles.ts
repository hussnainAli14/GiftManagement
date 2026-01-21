import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { colors } from '../../theme';
import { typography } from '../../theme';

export const getTagStyles = (
  customStyles?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    paddingVertical?: number;
    paddingHorizontal?: number;
  }
) => {
  const {
    backgroundColor: customBg,
    textColor: customText,
    borderColor: customBorder,
    borderWidth: customBorderWidth,
    borderRadius: customRadius,
    paddingVertical: customPaddingV,
    paddingHorizontal: customPaddingH,
  } = customStyles || {};

  // Container style
  const containerStyle: ViewStyle = {
    backgroundColor: customBg || colors.white,
    borderColor: customBorder || 'transparent',
    borderWidth: customBorderWidth ?? 0,
    borderRadius: customRadius ?? 16,
    paddingVertical: customPaddingV ?? 6,
    paddingHorizontal: customPaddingH ?? 12,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Text style
  const textStyle: TextStyle = {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold as '600',
    lineHeight: typography.fontSize.sm * 1.5,
    color: customText || colors.darkPurple,
  };

  return {
    container: containerStyle,
    text: textStyle,
  };
};

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold as '600',
    lineHeight: typography.fontSize.sm * 1.5,
    color: colors.darkPurple,
  },
});
