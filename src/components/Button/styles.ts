import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { ButtonVariant, ButtonSize } from './types';

export const getButtonStyles = (
  variant: ButtonVariant,
  size: ButtonSize,
  disabled: boolean,
  customStyles?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    paddingVertical?: number;
    paddingHorizontal?: number;
    borderWidth?: number;
    borderRadius?: number;
    fullWidth?: boolean;
  }
) => {
  const {
    backgroundColor: customBg,
    textColor: customText,
    borderColor: customBorder,
    paddingVertical: customPaddingV,
    paddingHorizontal: customPaddingH,
    borderWidth: customBorderWidth,
    borderRadius: customRadius,
    fullWidth,
  } = customStyles || {};

  // Size-based padding
  const sizePadding = {
    small: { vertical: 8, horizontal: 16 },
    medium: { vertical: 12, horizontal: 24 },
    large: { vertical: 16, horizontal: 32 },
  };

  // Variant-based colors
  const getVariantColors = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: customBg || colors.primary,
          textColor: customText || colors.white,
          borderColor: customBorder || 'transparent',
        };
      case 'secondary':
        return {
          backgroundColor: customBg || colors.white,
          textColor: customText || colors.primary,
          borderColor: customBorder || colors.primary,
        };
      case 'text':
        return {
          backgroundColor: customBg || 'transparent',
          textColor: customText || colors.primary,
          borderColor: customBorder || 'transparent',
        };
      default:
        return {
          backgroundColor: customBg || colors.primary,
          textColor: customText || colors.white,
          borderColor: customBorder || 'transparent',
        };
    }
  };

  const variantColors = getVariantColors();

  // Base container style
  const containerStyle: ViewStyle = {
    backgroundColor: variantColors.backgroundColor,
    borderColor: variantColors.borderColor,
    borderWidth: variant === 'secondary' ? (customBorderWidth ?? 1) : 0,
    borderRadius: customRadius ?? 8,
    paddingVertical: customPaddingV ?? sizePadding[size].vertical,
    paddingHorizontal: customPaddingH ?? sizePadding[size].horizontal,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.6 : 1,
    ...(fullWidth && { width: '100%' }),
  };

  // Base text style
  const textStyle: TextStyle = {
    ...typography.textStyles.button,
    color: variantColors.textColor,
    textAlign: 'center',
  };

  return {
    container: containerStyle,
    text: textStyle,
  };
};

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.textStyles.button,
  },
});
