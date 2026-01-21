import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { colors } from '../../theme';
import { typography } from '../../theme';

export const getTextInputStyles = (
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
    return customBorder || colors.darkGray;
  };

  // Container style
  const containerStyle: ViewStyle = {
    width: fullWidth ? '100%' : undefined,
    marginBottom: 16,
  };

  // Label style
  const labelStyle: TextStyle = {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold as '600',
    lineHeight: typography.fontSize.base * 1.5,
    color: '#000000',
    marginBottom: 8,
  };

  // Input container style
  const inputContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: customBg || colors.white,
    borderColor: getBorderColor(),
    borderWidth: customBorderWidth ?? 1,
    borderRadius: customRadius ?? 12,
    paddingVertical: customPaddingV ?? 12,
    paddingHorizontal: customPaddingH ?? 16,
    opacity: disabled ? 0.6 : 1,
  };

  // Input style
  const inputStyle: TextStyle = {
    ...typography.textStyles.body,
    flex: 1,
    color: customText || '#000000',
    padding: 0,
    margin: 0,
  };

  // Placeholder style
  const placeholderStyle: TextStyle = {
    color: customPlaceholder || '#000000',
  };

  // Error text style
  const errorStyle: TextStyle = {
    ...typography.textStyles.caption,
    color: colors.primary,
    marginTop: 4,
  };

  // Icon container style
  const iconContainerStyle: ViewStyle = {
    marginRight: 12,
  };

  const rightIconContainerStyle: ViewStyle = {
    marginLeft: 12,
  };

  return {
    container: containerStyle,
    label: labelStyle,
    inputContainer: inputContainerStyle,
    input: inputStyle,
    placeholder: placeholderStyle,
    error: errorStyle,
    iconContainer: iconContainerStyle,
    rightIconContainer: rightIconContainerStyle,
  };
};

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold as '600',
    lineHeight: typography.fontSize.base * 1.5,
    color: '#000000',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.darkGray,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  input: {
    ...typography.textStyles.body,
    flex: 1,
    color: '#000000',
    padding: 0,
    margin: 0,
  },
  error: {
    ...typography.textStyles.caption,
    color: colors.primary,
    marginTop: 4,
  },
  iconContainer: {
    marginRight: 12,
  },
  rightIconContainer: {
    marginLeft: 12,
  },
});
