import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { colors } from '../../theme';
import { typography } from '../../theme';

export const getDropdownStyles = (
  disabled: boolean,
  error?: string,
  focused?: boolean,
  customStyles?: {
    borderColor?: string;
    focusedBorderColor?: string;
    errorBorderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    placeholderTextColor?: string;
    borderRadius?: number;
    borderWidth?: number;
    paddingVertical?: number;
    paddingHorizontal?: number;
    fullWidth?: boolean;
  }
) => {
  const {
    borderColor: customBorder,
    focusedBorderColor: customFocusedBorder,
    errorBorderColor: customErrorBorder,
    backgroundColor: customBg,
    textColor: customText,
    placeholderTextColor: customPlaceholder,
    borderRadius: customRadius,
    borderWidth: customBorderWidth,
    paddingVertical: customPaddingV,
    paddingHorizontal: customPaddingH,
    fullWidth = true,
  } = customStyles || {};

  // Determine border color
  const getBorderColor = () => {
    if (error) {
      return customErrorBorder || colors.primary;
    }
    if (focused) {
      return customFocusedBorder || customBorder || colors.primary;
    }
    return customBorder || colors.gray;
  };

  // Container style
  const containerStyle: ViewStyle = {
    width: fullWidth ? '100%' : undefined,
    marginBottom: 16,
  };

  // Label style
  const labelStyle: TextStyle = {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold as '700',
    lineHeight: typography.fontSize.base * 1.5,
    color: '#000000',
    marginBottom: 8,
  };

  // Dropdown container style
  const dropdownContainerStyle: ViewStyle = {
    backgroundColor: customBg || colors.white,
    borderColor: getBorderColor(),
    borderWidth: customBorderWidth ?? 1,
    borderRadius: customRadius ?? 8,
    paddingVertical: customPaddingV ?? 12,
    paddingHorizontal: customPaddingH ?? 16,
    opacity: disabled ? 0.6 : 1,
    minHeight: 48,
  };

  // Selected text style
  const selectedTextStyle: TextStyle = {
    ...typography.textStyles.body,
    color: customText || '#000000',
  };

  // Placeholder style
  const placeholderStyle: TextStyle = {
    ...typography.textStyles.body,
    color: customPlaceholder || '#000000',
  };

  // Error text style
  const errorStyle: TextStyle = {
    ...typography.textStyles.caption,
    color: colors.primary,
    marginTop: 4,
  };

  return {
    container: containerStyle,
    label: labelStyle,
    dropdownContainer: dropdownContainerStyle,
    selectedText: selectedTextStyle,
    placeholder: placeholderStyle,
    error: errorStyle,
  };
};

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold as '700',
    lineHeight: typography.fontSize.base * 1.5,
    color: '#000000',
    marginBottom: 8,
  },
  dropdownContainer: {
    backgroundColor: colors.white,
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  selectedText: {
    ...typography.textStyles.body,
    color: '#000000',
  },
  placeholder: {
    ...typography.textStyles.body,
    color: '#000000',
  },
  error: {
    ...typography.textStyles.caption,
    color: colors.primary,
    marginTop: 4,
  },
});
