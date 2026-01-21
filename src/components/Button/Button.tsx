import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { ButtonProps } from './types';
import { getButtonStyles } from './styles';

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  backgroundColor,
  textColor,
  borderColor,
  paddingVertical,
  paddingHorizontal,
  borderWidth,
  borderRadius,
  fullWidth = false,
  style,
  textStyle,
  loading = false,
  onPress,
  ...touchableProps
}) => {
  const isDisabled = disabled || loading;

  const buttonStyles = getButtonStyles(variant, size, isDisabled, {
    backgroundColor,
    textColor,
    borderColor,
    paddingVertical,
    paddingHorizontal,
    borderWidth,
    borderRadius,
    fullWidth,
  });

  const handlePress = (event: any) => {
    if (!isDisabled && onPress) {
      onPress(event);
    }
  };

  return (
    <TouchableOpacity
      {...touchableProps}
      style={[buttonStyles.container, style]}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={buttonStyles.text.color}
        />
      ) : (
        <Text style={[buttonStyles.text, textStyle]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
