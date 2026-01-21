import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { colors } from '../../theme';
import { typography } from '../../theme';

export const getMultiStepInputStyles = (
  disabled: boolean,
  error?: string,
  focusedIndex?: number,
  customStyles?: {
    borderColor?: string;
    focusedBorderColor?: string;
    errorBorderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: number;
    borderWidth?: number;
    boxSize?: number;
    spacing?: number;
  }
) => {
  const {
    borderColor: customBorder,
    focusedBorderColor: customFocusedBorder,
    errorBorderColor: customErrorBorder,
    backgroundColor: customBg,
    textColor: customText,
    borderRadius: customRadius,
    borderWidth: customBorderWidth,
    boxSize = 48,
    spacing = 8,
  } = customStyles || {};

  // Determine border color for a specific index
  const getBorderColor = (index: number) => {
    if (error) {
      return customErrorBorder || colors.primary;
    }
    if (focusedIndex === index) {
      return customFocusedBorder || customBorder || colors.primary;
    }
    return customBorder || colors.gray;
  };

  // Container style
  const containerStyle: ViewStyle = {
    width: '100%',
    marginBottom: 16,
  };

  // Label style
  const labelStyle: TextStyle = {
    ...typography.textStyles.label,
    color: colors.darkPurple,
    marginBottom: 12,
  };

  // Input container style
  const inputContainerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing,
  };

  // Individual input box style
  const getInputBoxStyle = (index: number): ViewStyle => ({
    width: boxSize,
    height: boxSize,
    backgroundColor: customBg || colors.white,
    borderColor: getBorderColor(index),
    borderWidth: customBorderWidth ?? 1,
    borderRadius: customRadius ?? 8,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.6 : 1,
  });

  // Input text style
  const inputTextStyle: TextStyle = {
    ...typography.textStyles.h4,
    color: customText || colors.darkPurple,
    textAlign: 'center',
  };

  // Error text style
  const errorStyle: TextStyle = {
    ...typography.textStyles.caption,
    color: colors.primary,
    marginTop: 8,
  };

  return {
    container: containerStyle,
    label: labelStyle,
    inputContainer: inputContainerStyle,
    getInputBox: getInputBoxStyle,
    inputText: inputTextStyle,
    error: errorStyle,
  };
};

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    ...typography.textStyles.label,
    color: colors.darkPurple,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputBox: {
    width: 48,
    height: 48,
    backgroundColor: colors.white,
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputText: {
    ...typography.textStyles.h4,
    color: colors.darkPurple,
    textAlign: 'center',
  },
  error: {
    ...typography.textStyles.caption,
    color: colors.primary,
    marginTop: 8,
  },
});
